import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrintService {
  print(title: string, html: string): void {
    const popup = window.open('', '_blank', 'width=1200,height=900');
    if (!popup) {
      return;
    }

    popup.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d4d4d8; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
    popup.close();
  }
}
