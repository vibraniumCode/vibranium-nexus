export interface TCombustible {
  id: number;
  tipo: string;
}

export interface Combustible {
  idTipo: number;
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
  id?: number;
  Combustible: string;
  Imp_combustible: number;
  Impuesto: string;
  Imp_impuesto: number;
  Imp_total: number;
}