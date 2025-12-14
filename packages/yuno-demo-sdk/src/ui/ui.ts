import { format } from "date-fns";
import React, { useState } from "react";

// ==================== TIPOS ====================
interface FormFieldBase {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  value?: any;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: any) => void;
}

type FormFieldType = FormFieldBase & {
  variant:
    | "Input"
    | "Email"
    | "Phone"
    | "Select"
    | "Multi Select"
    | "Payment Method Selector"
    | "Credit Card"
    | "PayPal"
    | "Apple Pay"
    | "Google Pay"
    | "Date Picker"
    | "Textarea"
    | "Checkbox"
    | "Switch"
    | "Input OTP"
    | "Combobox"
    | "Coupon Code"
    | "Amount Input"
    | "Currency Select";
};

// ==================== DATOS ESTÁTICOS ====================
const countries = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "Mexico", value: "MX" },
  { label: "Spain", value: "ES" },
  { label: "United Kingdom", value: "GB" },
];

const paymentMethods = [
  { label: "Credit Card", value: "credit_card" },
  { label: "PayPal", value: "paypal" },
  { label: "Apple Pay", value: "apple_pay" },
  { label: "Google Pay", value: "google_pay" },
];

const currencies = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "GBP - British Pound", value: "GBP" },
  { label: "MXN - Mexican Peso", value: "MXN" },
  { label: "CAD - Canadian Dollar", value: "CAD" },
];

const paymentOptions = [
  { label: "Split Payment", value: "split_payment" },
  { label: "Installments", value: "installments" },
  { label: "Save Card for Future", value: "save_card" },
];

const states = [
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "Florida", value: "FL" },
  { label: "New York", value: "NY" },
];

// ==================== COMPONENTES UI (simplificados para el SDK) ====================
const Button = ({ children, onClick, disabled, variant = "default", className = "" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
      variant === "outline"
        ? "border bg-white hover:bg-gray-50"
        : variant === "secondary"
        ? "bg-gray-200 hover:bg-gray-300"
        : "bg-blue-600 text-white hover:bg-blue-700"
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ id, placeholder, value, onChange, disabled, required, type = "text", maxLength, className = "" }: any) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    required={required}
    maxLength={maxLength}
    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 ${className}`}
  />
);

const Label = ({ htmlFor, children, className = "" }: any) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
    {children}
  </label>
);

const Select = ({ value, onValueChange, children }: any) => {
  const [open, setOpen] = useState(false);
  return <div className="relative">{children}</div>;
};

const SelectTrigger = ({ id, disabled, children }: any) => (
  <button
    id={id}
    disabled={disabled}
    className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
  >
    {children}
  </button>
);

const SelectValue = ({ placeholder }: any) => <span className="text-gray-500">{placeholder}</span>;

const SelectContent = ({ children }: any) => (
  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
    {children}
  </div>
);

const SelectItem = ({ value, children, onClick }: any) => (
  <div
    onClick={() => onClick?.(value)}
    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
  >
    {children}
  </div>
);

const Textarea = ({ id, placeholder, value, onChange, disabled, required, rows = 4 }: any) => (
  <textarea
    id={id}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    required={required}
    rows={rows}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
  />
);

const Checkbox = ({ id, checked, onCheckedChange, disabled }: any) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    disabled={disabled}
    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
  />
);

const Switch = ({ checked, onCheckedChange, disabled }: any) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
      checked ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

// ==================== COMPONENTE PRINCIPAL DE RENDERIZADO ====================
const RenderFormField: React.FC<{ field: FormFieldType }> = ({ field }) => {
  const [value, setValue] = useState(field.value || "");
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(field.value) ? field.value : []
  );
  const [date, setDate] = useState<Date | undefined>(
    field.value instanceof Date ? field.value : undefined
  );
  const [otp, setOtp] = useState("");
  const [creditCard, setCreditCard] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [paypalEmail, setPaypalEmail] = useState("");
  const [applePayData, setApplePayData] = useState({ token: "", deviceId: "" });
  const [googlePayData, setGooglePayData] = useState({ token: "", accountId: "" });
  const [openCombobox, setOpenCombobox] = useState(false);

  const handleChange = (value: string | boolean | Date | string[]) => {
    if (typeof value === "boolean" && value === false) return;
    setValue(value as any);
    field.onChange?.(value);
  };

  const handleMultiSelect = (selectedValue: string) => {
    const updated = selectedValues.includes(selectedValue)
      ? selectedValues.filter((v) => v !== selectedValue)
      : [...selectedValues, selectedValue];
    setSelectedValues(updated);
    field.onChange(updated);
  };

  const formatCardNumber = (num: string) =>
    num.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();

  switch (field.variant) {
    case "Input":
    case "Email":
    case "Phone":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.variant === "Email" ? "email" : field.variant === "Phone" ? "tel" : "text"}
            placeholder={field.placeholder}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e: any) => handleChange(e.target.value)}
            disabled={field.disabled}
            required={field.required}
          />
          {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
        </div>
      );

    case "Textarea":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e: any) => handleChange(e.target.value)}
            disabled={field.disabled}
            required={field.required}
          />
          {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
        </div>
      );

    case "Checkbox":
      return (
        <div className="flex items-start space-x-2">
          <Checkbox
            id={field.name}
            checked={checked}
            onCheckedChange={(isChecked: boolean) => {
              setChecked(isChecked);
              handleChange(isChecked);
            }}
            disabled={field.disabled}
          />
          <div>
            <Label htmlFor={field.name} className="cursor-pointer">{field.label}</Label>
            {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
          </div>
        </div>
      );

    case "Switch":
      return (
        <div className="flex items-center justify-between">
          <div>
            <Label>{field.label}</Label>
            {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
          </div>
          <Switch
            checked={checked}
            onCheckedChange={(isChecked: boolean) => {
              setChecked(isChecked);
              handleChange(isChecked);
            }}
            disabled={field.disabled}
          />
        </div>
      );

    case "Amount Input":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder || "0.00"}
              value={typeof value === "string" || typeof value === "number" ? value : ""}
              onChange={(e: any) => handleChange(e.target.value)}
              disabled={field.disabled}
              required={field.required}
              className="pl-8"
            />
          </div>
          {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
        </div>
      );

    default:
      return <div className="text-red-500">Campo no soportado: {field.variant}</div>;
  }
};

// ==================== SDK PÚBLICO ====================
export const FormSDK = {
  /**
   * Renderiza un campo de formulario desde un JSON
   * @param fieldJson - Configuración del campo en formato JSON
   * @returns Componente React renderizado
   */
  Render: (fieldJson: string | object) => {
    try {
      const field = typeof fieldJson === "string" ? JSON.parse(fieldJson) : fieldJson;
      
      // Validación básica
      if (!field.variant || !field.name || !field.label) {
        throw new Error("El JSON debe contener: variant, name y label");
      }

      // Asegurar que onChange existe
      if (!field.onChange) {
        field.onChange = (value: any) => console.log(`${field.name}:`, value);
      }

      return <RenderFormField field={field as FormFieldType} />;
    } catch (error) {
      return (
        <div className="rounded-md border border-red-500 bg-red-50 p-4 text-red-700">
          Error al renderizar: {error instanceof Error ? error.message : "Error desconocido"}
        </div>
      );
    }
  },

  /**
   * Renderiza múltiples campos desde un array de JSON
   */
  RenderMultiple: (fieldsJson: string | object[]) => {
    try {
      const fields = typeof fieldsJson === "string" ? JSON.parse(fieldsJson) : fieldsJson;
      
      if (!Array.isArray(fields)) {
        throw new Error("Debe proporcionar un array de campos");
      }

      return (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.name || index}>
              {FormSDK.Render(field)}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return (
        <div className="rounded-md border border-red-500 bg-red-50 p-4 text-red-700">
          Error al renderizar múltiples campos: {error instanceof Error ? error.message : "Error desconocido"}
        </div>
      );
    }
  },

  /**
   * Tipos disponibles de campos
   */
  FieldTypes: [
    "Input", "Email", "Phone", "Select", "Multi Select",
    "Payment Method Selector", "Credit Card", "PayPal",
    "Apple Pay", "Google Pay", "Date Picker", "Textarea",
    "Checkbox", "Switch", "Input OTP", "Combobox",
    "Coupon Code", "Amount Input", "Currency Select"
  ],
};

// Exportar todo lo necesario
export type { FormFieldType };
export default FormSDK;
