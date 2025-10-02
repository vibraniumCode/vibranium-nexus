// types/table.ts

export interface ActionConfig {
  showDetail?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  editLabel?: string;
  editType?: 'input' | 'form'; // Nuevo: tipo de edición
}

export interface TableColumn {
  key: string;
  label: string;
}
