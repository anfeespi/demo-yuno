"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RenderFormField } from "@/components/screens/render-form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { FormFieldType } from "@/types";
import { ColorPickerFormDemo } from "@/components/theme-picker";

const STORAGE_KEY = "local-theme-config";

export default function Page() {
  const [themeVars, setThemeVars] = useState<Record<string, string>>({});
  const [apiResponse, setApiResponse] = useState<string>("");
  const [formFields, setFormFields] = useState<FormFieldType[]>([]);

  const saveTheme = (newVars: Record<string, string>) => {
    setThemeVars(newVars);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setThemeVars(JSON.parse(saved));
    }
    handleApiRequest(); // Fetch form fields on mount
  }, []);

  const handleApiRequest = async () => {
    try {
      const response = await fetch("http://52.15.192.69:8080/api/payments/style");
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
      if (Array.isArray(data)) {
        setFormFields(data);
      } else {
        console.error("API response is not an array");
      }
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    }
  };

  const schema = z.object({
    email: z.string().email(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div className="flex items-center justify-center min-h-screen gap-4">
      <ColorPickerFormDemo onSave={saveTheme} />
      <div style={themeVars as React.CSSProperties}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Formulario</CardTitle>
            <CardDescription>Completa los campos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => console.log(data))}
                className="space-y-4"
              >
                {formFields.map((field) => (
                  <RenderFormField key={field.name} field={field} />
                ))}
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
