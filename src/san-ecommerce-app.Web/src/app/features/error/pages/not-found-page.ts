import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, SHARED_IMPORTS, MATERIAL_IMPORTS],
  template: `
    <section class="error-page app-card">
      <mat-icon>search_off</mat-icon>
      <h1>{{ 'errors.notFoundTitle' | translate }}</h1>
      <p>{{ 'errors.notFoundMessage' | translate }}</p>
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
      }
    `,
  ],
})
export class NotFoundPage {}
