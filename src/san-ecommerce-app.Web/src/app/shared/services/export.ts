import { Injectable } from '@angular/core';

        @Injectable({ providedIn: 'root' })
        export class ExportService {
          exportCsv(filename: string, rows: readonly Record<string, unknown>[]): void {
            this.download(filename.endsWith('.csv') ? filename : `${filename}.csv`, 'text/csv;charset=utf-8', rows, ',');
          }

          exportExcel(filename: string, rows: readonly Record<string, unknown>[]): void {
            this.download(
              filename.endsWith('.xls') ? filename : `${filename}.xls`,
              'application/vnd.ms-excel;charset=utf-8',
              rows,
              '	',
            );
          }

          private download(
            filename: string,
            type: string,
            rows: readonly Record<string, unknown>[],
            separator: string,
          ): void {
            if (rows.length === 0) {
              return;
            }

            const headers = Object.keys(rows[0]);
            const content = [
              headers.join(separator),
              ...rows.map((row) =>
                headers
                  .map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`)
                  .join(separator),
              ),
            ].join('\n');

            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = filename;
            anchor.click();
            URL.revokeObjectURL(url);
          }
        }
