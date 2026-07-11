import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ErrorStateService } from '@core/services/error-state';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-server-error-page',
  imports: [RouterLink, SHARED_IMPORTS, MATERIAL_IMPORTS],
  template: `
    <section class="error-page app-card">
      <mat-icon>error</mat-icon>
      <h1>{{ errorState.error().title }}</h1>
      <p>{{ errorState.error().message }}</p>
      <a mat-flat-button color="primary" routerLink="/dashboard">{{ 'common.backHome' | translate }}</a>
    </section>
  `,
  styles: [
    `
      .error-page {
        min-height: 100vh;
        display: grid;
        place-content: center;
        gap: 1rem;
        text-align: center;
        padding: 2rem;
      }

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin: 0 auto;
        color: var(--mat-sys-error);
      }
    `,
  ],
})
export class ServerErrorPage {
  readonly errorState = inject(ErrorStateService);
}
