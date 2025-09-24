export interface Impuesto {
  id: number;
  tipo: string;
}

export interface ImpEstacion {
  nombre?: string;
  tipo: string;
  importe: number;
  fec_carga?: string;
}