import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '@core/authentication/auth';
import { ErrorStateService } from '@core/services/error-state';
import { NotificationService } from '@core/services/notification';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const notifications = inject(NotificationService);
  const errorState = inject(ErrorStateService);
  const session = authService.session();
  const authRequest = session
    ? request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + session.accessToken,
        },
      })
    : request;

  return next(authRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 0) {
        notifications.error('Network error. Please verify the API is reachable.');
        return throwError(() => error);
      }

      const isAuthRequest =
        request.url.includes('/Auth/login') || request.url.includes('/Auth/refresh-token');

      if (error.status === 401 && !isAuthRequest && authService.session()) {
        return authService.refreshToken().pipe(
          switchMap((refreshedSession) =>
            next(
              request.clone({
                setHeaders: {
                  Authorization: 'Bearer ' + refreshedSession.accessToken,
                },
              }),
            ),
          ),
          catchError((refreshError) => {
            authService.logout(false, 'Your session has expired.');
            return throwError(() => refreshError);
          }),
        );
      }

      if (error.status >= 500) {
        errorState.set({
          title: 'Server error',
          message: error.error?.detail ?? 'The server returned an unexpected response.',
        });
      }

      return throwError(() => error);
    }),
  );
};
