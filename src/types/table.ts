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

// Opcional: tipos para los campos del formulario
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: any }>; // Para campos select
}