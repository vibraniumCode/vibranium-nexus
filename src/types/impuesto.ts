export interface Impuesto {
  id: number;
  tipo: string;
}

// export interface ImpEstacion {
//   nombre?: string;
//   tipo: string;
//   importe: number;
//   fec_carga?: string;
// }

// export interface ImpuestoDetalle {
//   impEstacion: string;
//   importe: number;
// }

// export interface TipoImpuesto {
//   id: number;
//   tipo: string;
// }

// export interface DatoChart {
//   impuestoId: number;
//   tipo: string;
//   yr: number;
//   mth: number;
//   mesLabel: string;
//   total: number;
// }

// export interface ChartSeries {
//   name: string;
//   data: number[];
// }

// export interface ChartData {
//   categories: string[];
//   series: ChartSeries[];
// }

export interface CTImpuesto {
  idCombustible: number;
  tipo: string;
  importe: number;
}