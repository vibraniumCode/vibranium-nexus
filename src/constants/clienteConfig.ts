import type { FormField } from "@/types/form"; // ✅ Importar desde form.ts
import type { TableColumn } from "@/types/table";

export const clienteColumns: TableColumn[] = [
  { key: "id", label: 'id' },
  { key: "nombre", label: "Nombre" },
  { key: "direccion", label: "Dirección" },
  { key: "cuit", label: "CUIT" },
];

export const clienteFormFields: FormField[] = [
  { name: "nombre", type: "text", label: "Nombre del cliente", placeholder: "Ingrese el nombre", required: true, width: "half" },
  { name: "cuit", type: "text", label: "CUIT", placeholder: "Ingrese el CUIT", required: true, width: "half" },
  { name: "direccion", type: "text", label: "Dirección", placeholder: "Ingrese la dirección", required: true, width: "full" },
];