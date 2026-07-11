export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hidden?: boolean;
  sticky?: 'start' | 'end';
  cell?: (row: Record<string, unknown>) => string;
}

export interface DataTableQuery {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  direction?: 'asc' | 'desc' | '';
  search?: string;
  filters?: Record<string, string | boolean>;
}

export interface DataTableAction {
  id: string;
  label: string;
  icon: string;
  color?: 'primary' | 'accent' | 'warn';
  permission?: string;
}
