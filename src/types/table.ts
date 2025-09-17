export interface ActionConfig {
  showDetail?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  editLabel?: string;
  detailLabel?: string;
  deleteLabel?: string;
}

// Ahora, TableColumn define CONFIGURACIÓN de las columnas
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
}