export interface Empresa {
  id: number;
  nombre: string;
  cuit: string;
  ingBrutos: string;
  direccion: string;
  cp: string;
  localidad: string;
  provincia: string;
  actividad: string | Date;
  telefono: string;
}

export enum CategoriaFiscal {
  RESPONSABLE_INSCRIPTO = 'responsable_inscripto',
}