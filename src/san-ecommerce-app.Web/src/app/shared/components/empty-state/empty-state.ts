import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly icon = input('hourglass_empty');
  readonly title = input.required<string>();
  readonly description = input('');
  readonly actionText = input('');
  readonly actionRoute = input('');
}
