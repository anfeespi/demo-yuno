"use client";

import Link from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Editor from "@/components/editor/editor";
import { EditFieldDialog } from "@/components/screens/edit-field-dialog";
// import SpecialComponentsNotice from '@/components/playground/special-component-notice'
import { FieldSelector } from "@/components/screens/field-selector";
import { FormFieldList } from "@/components/screens/form-field-list";
import { FormPreview } from "@/components/screens/form-preview";
import { Button } from "@/components/ui/button";
import If from "@/components/ui/if";
import { Separator } from "@/components/ui/separator";
import {
  defaultFieldConfig,
  FORM_LIBRARIES,
  type FormLibrary,
} from "@/constants";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { FormFieldType } from "@/types";

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export default function FormBuilder() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<FormLibrary>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("formLibrary") as FormLibrary) ||
        FORM_LIBRARIES.REACT_HOOK_FORM
      );
    }
    return FORM_LIBRARIES.REACT_HOOK_FORM;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formLibrary", selectedLibrary);
    }
  }, [selectedLibrary]);

  const addFormField = (variant: string, index: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`;

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: "",
      description: "",
      placeholder: "",
    };

    const newField: FormFieldType = {
      checked: true,
      description: description || "",
      disabled: false,
      label: label || newFieldName,
      name: newFieldName,
      onChange: () => {},
      onSelect: () => {},
      placeholder: placeholder || "Placeholder",
      required: true,
      rowIndex: index,
      setValue: () => {},
      type: "",
      value: "",
      variant,
    };
    setFormFields([...formFields, newField]);
  };

  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string,
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[],
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i];
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i]);
          if (result) return result;
        } else if (field.name === name) {
          return [...currentPath, i];
        }
      }
      return null;
    };
    return search(fields, []);
  };

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields)); // Deep clone
    let current: any = updatedFields;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    };
    setFormFields(updatedFields);
  };

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field);
    setIsDialogOpen(true);
  };

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name);
      if (path) {
        updateFormField(path, updatedField);
      }
    }
    setIsDialogOpen(false);
  };

  const handleSaveForm = async () => {
    try {
      const jsonString = JSON.stringify(formFields);
      console.log("Sending data:", jsonString);
      
      const response = await fetch("http://52.15.192.69:8080/api/payments/style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: jsonString,
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Form saved successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to save form:", errorText);
        alert(`Failed to save form: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert(`Error saving form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const FieldSelectorWithSeparator = ({
    addFormField,
  }: {
    addFormField: (variant: string, index?: number) => void;
  }) => (
    <div className="flex flex-col md:flex-row gap-3">
      <FieldSelector addFormField={addFormField} />
      <Separator orientation={isDesktop ? "vertical" : "horizontal"} />
    </div>
  );

  return (
    <section className="">
      <If
        condition={formFields.length > 0}
        render={() => (
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
            <div className="w-full col-span-1 flex flex-col md:flex-row ">
              <FieldSelectorWithSeparator
                addFormField={(variant: string, index: number = 0) =>
                  addFormField(variant, index)
                }
              />
              <div className="overflow-y-auto flex-1 ">
                <FormFieldList
                  formFields={formFields}
                  setFormFields={setFormFields}
                  updateFormField={updateFormField}
                  openEditDialog={openEditDialog}
                />
              </div>
            </div>
            <div className="col-span-1 w-full space-y-3">
              {/*<SpecialComponentsNotice formFields={formFields} />*/}
              <FormPreview
                key={JSON.stringify(formFields)}
                formFields={formFields}
                selectedLibrary={selectedLibrary}
                onLibraryChange={setSelectedLibrary}
              />
              <Button onClick={handleSaveForm} className="w-full">
                Guardar
              </Button>
            </div>
          </div>
        )}
        otherwise={() => (
          <div className="flex flex-col md:flex-row items-center gap-3 md:px-5">
            <FieldSelectorWithSeparator
              addFormField={(variant: string, index: number = 0) =>
                addFormField(variant, index)
              }
            />
            <Image
              src="oc-thinking.svg"
              alt="Empty list"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        )}
      />
      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </section>
  );
}
