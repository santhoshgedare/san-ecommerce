import { Component, input } from '@angular/core';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-no-data',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './no-data.html',
  styleUrl: './no-data.scss',
})
export class NoData {
  readonly title = input('No records found');
  readonly description = input('Try changing your filters or create a new record.');
}
