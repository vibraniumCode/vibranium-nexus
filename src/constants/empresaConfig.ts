// constants/empresaConfig.ts
// import type { Empresa } from "@/types/empresa";
import type { FormField } from "@/types/form"; // ✅ Importar desde form.ts
import type { TableColumn } from "@/types/table";

export const empresaColumns: TableColumn[] = [
  { key: "id", label: 'id' },
  { key: "nombre", label: "Nombre" },
  { key: "cuit", label: "CUIT" },
  { key: "ingBrutos", label: "Ingresos Brutos" },
  { key: "direccion", label: "Dirección" },
  { key: "cp", label: "Código Postal" },
  { key: "localidad", label: "Localidad" },
  { key: "provincia", label: "Provincia" },
  { key: "Actividad", label: "Actividad" },
];

export const empresaFormFields: FormField[] = [
  { name: "nombre", type: "text", label: "Nombre de la empresa", placeholder: "Ingrese el nombre", required: true, width: "full" },
  { name: "cuit", type: "text", label: "CUIT", placeholder: "Ingrese el CUIT", required: true, width: "half" },
  { name: "ingBrutos", type: "text", label: "Ingresos Brutos", placeholder: "Ingrese los ingresos brutos", required: false, width: "half" },
  { name: "direccion", type: "text", label: "Dirección", placeholder: "Ingrese la dirección", required: true, width: "full" },
  { name: "cp", type: "text", label: "Código Postal", placeholder: "Ingrese el código postal", required: false, width: "half" },
  { name: "localidad", type: "text", label: "Localidad", placeholder: "Ingrese la localidad", required: false, width: "half" },
  { name: "provincia", type: "text", label: "Provincia", placeholder: "Ingrese la provincia", required: false, width: "half" },
  { name: "telefono", type: "text", label: "Teléfono", placeholder: "Ingrese el teléfono", required: false, width: "half" },
  { name: "Actividad", type: "text", label: "Actividad", placeholder: "Ingrese la actividad", required: false, width: "full" },
];