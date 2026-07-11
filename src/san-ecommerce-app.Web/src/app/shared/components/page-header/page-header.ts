import { Component, input } from '@angular/core';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-page-header',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly eyebrow = input('');
}
