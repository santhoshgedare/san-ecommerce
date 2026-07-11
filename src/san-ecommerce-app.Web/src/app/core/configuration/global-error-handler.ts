import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorStateService } from '@core/services/error-state';
import { NotificationService } from '@core/services/notification';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errorState = inject(ErrorStateService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unexpected application error.';
    this.errorState.set({
      title: 'Application error',
      message,
    });
    this.notificationService.error(message);
    void this.router.navigate(['/500']);
    console.error(error);
  }
}
