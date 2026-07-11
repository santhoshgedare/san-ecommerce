import { Component, output } from '@angular/core';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-search-box',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  readonly searchChanged = output<string>();

  update(event: Event): void {
    const value = event.target instanceof HTMLInputElement ? event.target.value : '';
    this.searchChanged.emit(value.trim());
  }
}
