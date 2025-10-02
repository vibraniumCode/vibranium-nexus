export interface FormField {
  name: string;
  type: "text" | "email" | "number" | "select" | "textarea";
  label: string;
  placeholder?: string;
  required?: boolean;
  width?: "full" | "half"; // ✅ Agregado (lo usas en tu config)
  options?: Array<{ label: string; value: any }>; // Para campos select
}