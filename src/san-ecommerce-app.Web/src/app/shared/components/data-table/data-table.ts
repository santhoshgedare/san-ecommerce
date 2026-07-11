import { SelectionModel } from '@angular/cdk/collections';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { PermissionService } from '@core/authorization/permission';
import { ExportService } from '@shared/services/export';
import { PrintService } from '@shared/services/print';
import { DataTableAction, DataTableColumn, DataTableQuery } from '@shared/models/data-table.models';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';
import { NoData } from '@shared/components/no-data/no-data';

@Component({
  selector: 'app-data-table',
  imports: [NoData, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  readonly title = input('');
  readonly rows = input<readonly Record<string, unknown>[]>([]);
  readonly columns = input<readonly DataTableColumn[]>([]);
  readonly loading = input(false);
  readonly totalCount = input(0);
  readonly pageSize = input(10);
  readonly pageIndex = input(0);
  readonly pageSizeOptions = input([10, 25, 50]);
  readonly selectionEnabled = input(false);
  readonly rowActions = input<readonly DataTableAction[]>([]);
  readonly selectionChange = output<readonly Record<string, unknown>[]>();
  readonly actionTriggered = output<{ actionId: string; row: Record<string, unknown> }>();
  readonly queryChange = output<DataTableQuery>();

  readonly search = signal('');
  readonly selectedColumns = signal<string[]>([]);
  readonly selection = new SelectionModel<Record<string, unknown>>(true, []);
  readonly visibleColumns = computed(() => {
    const selected = this.selectedColumns();
    const columns = this.columns();
    if (selected.length === 0) {
      return columns.filter((column) => !column.hidden);
    }
    return columns.filter((column) => selected.includes(column.key));
  });
  readonly displayedColumns = computed(() => {
    const columns = this.visibleColumns().map((column) => column.key);
    if (this.selectionEnabled()) {
      columns.unshift('select');
    }
    if (this.rowActions().length) {
      columns.push('actions');
    }
    return columns;
  });

  constructor(
    private readonly exportService: ExportService,
    private readonly printService: PrintService,
    readonly permissionService: PermissionService,
  ) {
    effect(() => {
      const defaultColumns = this.columns().filter((column) => !column.hidden).map((column) => column.key);
      if (defaultColumns.length && this.selectedColumns().length === 0) {
        this.selectedColumns.set(defaultColumns);
      }
    });

    effect(() => {
      this.rows();
      this.selection.clear();
    });
  }

  updateSearch(event: Event): void {
    const value = event.target instanceof HTMLInputElement ? event.target.value : '';
    this.search.set(value.trim());
    this.emitQuery({ search: this.search() });
  }

  changePage(event: PageEvent): void {
    this.emitQuery({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  sortChange(sort: Sort): void {
    this.emitQuery({ sort: sort.active, direction: sort.direction });
  }

  toggleColumn(key: string): void {
    this.selectedColumns.update((columns) =>
      columns.includes(key) ? columns.filter((column) => column !== key) : [...columns, key],
    );
  }

  trigger(actionId: string, row: Record<string, unknown>): void {
    this.actionTriggered.emit({ actionId, row });
  }

  toggleRow(row: Record<string, unknown>): void {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.rows().forEach((row) => this.selection.select(row));
    }
    this.selectionChange.emit(this.selection.selected);
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.rows().length && this.rows().length > 0;
  }

  exportCsv(): void {
    this.exportService.exportCsv(this.title() || 'data', this.rows());
  }

  exportExcel(): void {
    this.exportService.exportExcel(this.title() || 'data', this.rows());
  }

  print(): void {
    const columns = this.visibleColumns();
    const header = columns.map((column) => `<th>${column.label}</th>`).join('');
    const body = this.rows()
      .map(
        (row) =>
          `<tr>${columns
            .map((column) => `<td>${this.displayValue(row, column)}</td>`)
            .join('')}</tr>`,
      )
      .join('');
    this.printService.print(this.title() || 'Data', `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`);
  }

  displayValue(row: Record<string, unknown>, column: DataTableColumn): string {
    const value = column.cell ? column.cell(row) : row[column.key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value ?? '—');
  }

  trackByColumn(_: number, column: DataTableColumn): string {
    return column.key;
  }

  private emitQuery(partial: Partial<DataTableQuery>): void {
    this.queryChange.emit({
      pageIndex: partial.pageIndex ?? this.pageIndex(),
      pageSize: partial.pageSize ?? this.pageSize(),
      sort: partial.sort,
      direction: partial.direction,
      search: partial.search ?? this.search(),
      filters: partial.filters,
    });
  }
}
