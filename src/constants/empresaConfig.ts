// constants/empresaConfig.ts
import type { Empresa } from "@/types/empresa";

export const empresaColumns: { key: keyof Empresa; label: string }[] = [
  { key: "nombre", label: "Nombre" },
  { key: "cuit", label: "CUIT" },
  { key: "ingBrutos", label: "Ingresos Brutos" },
  { key: "direccion", label: "Dirección" },
  { key: "cp", label: "Código Postal" },
  { key: "localidad", label: "Localidad" },
  { key: "provincia", label: "Provincia" },
  { key: "actividad", label: "Actividad" },
];

export const empresaFormFields = [
  {
    name: "nombre",
    type: "text",
    label: "Nombre de la empresa",
    placeholder: "Ingrese el nombre de la empresa",
    required: true,
    width: "half",
  },
  {
    name: "cuit",
    type: "text",
    label: "CUIT",
    placeholder: "Ingrese el CUIT",
    required: true,
    width: "half",
  },
  {
    name: "ingBrutos",
    type: "text",
    label: "Ingresos Brutos",
    placeholder: "Ingrese los ingresos brutos",
    required: true,
    width: "half",
  },
  {
    name: "direccion",
    type: "text",
    label: "Dirección",
    placeholder: "Ingrese la dirección",
    required: true,
    width: "half",
  },
  {
    name: "cp",
    type: "text",
    label: "Código Postal",
    placeholder: "Ingrese el código postal",
    required: true,
    width: "half",
  },
  {
    name: "localidad",
    type: "text",
    label: "Localidad",
    placeholder: "Ingrese la localidad",
    required: true,
    width: "half",
  },
  {
    name: "provincia",
    type: "text",
    label: "Provincia",
    placeholder: "Ingrese la provincia",
    required: true,
    width: "half",
  },
  {
    name: "telefono",
    type: "text",
    label: "Teléfono",
    placeholder: "Ingrese el teléfono",
    required: false,
    width: "half",
  },
  {
    name: "Actividad",
    type: "text",
    label: "Actividad",
    placeholder: "Ingrese la actividad",
    required: true,
    width: "half",
  },
] as const;