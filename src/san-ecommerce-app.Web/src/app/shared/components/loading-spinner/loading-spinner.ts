import { Component, computed, inject, input } from '@angular/core';

import { LoadingService } from '@core/services/loading';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-loading-spinner',
  imports: [SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinner {
  readonly overlay = input(false);
  private readonly loadingService = inject(LoadingService);
  readonly visible = computed(() => this.loadingService.isLoading());
}
