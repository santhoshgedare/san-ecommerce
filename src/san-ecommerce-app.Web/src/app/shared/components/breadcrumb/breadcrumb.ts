import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbService } from '@core/services/breadcrumb';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  readonly breadcrumbService = inject(BreadcrumbService);
}
