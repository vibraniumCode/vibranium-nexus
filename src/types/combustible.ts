export interface Combustible {
  id: number;
  tipo: string;
  precio: number;
}

export interface CombustibleCreate {
  tipo: string;
  precio: number;
}

export interface CombustibleUpdate {
  tipo?: string;
  precio?: number;
}

export interface CombustibleDetalle {
  Combustible: string;
  Imp_combustible: number;
  Impuesto: string;
  Imp_impuesto: number;
  Imp_total: number;
}