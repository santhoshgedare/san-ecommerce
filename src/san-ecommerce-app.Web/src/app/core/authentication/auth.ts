import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';

import { TokenStorageService } from '@core/authentication/token-storage';
import {
  AuthResponse,
  AuthSession,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '@core/models/auth.models';
import { ApiUrlService } from '@core/services/api-url';
import { IdleTimeoutService } from '@core/services/idle-timeout';
import { NotificationService } from '@core/services/notification';
import { STORAGE_KEYS } from '@core/constants/storage.constants';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly idleTimeout = inject(IdleTimeoutService);
  private refreshTimeoutId: number | null = null;
  private refreshRequest$?: Observable<AuthSession>;

  readonly session = signal<AuthSession | null>(null);
  readonly isAuthenticated = computed(() => {
    const session = this.session();
    return !!session && !this.isExpired(session);
  });

  constructor() {
    this.idleTimeout.register(() => this.logout(false, 'Session timed out due to inactivity.'));
  }

  initialize(): void {
    const session = this.tokenStorage.getSession();
    if (!session) {
      return;
    }

    if (this.isExpired(session)) {
      this.session.set(session);
      this.refreshToken().subscribe({
        error: () => this.clearSession(),
      });
      return;
    }

    this.setSession(session);
  }

  login(request: LoginRequest): Observable<AuthSession> {
    return this.http
      .post<AuthResponse>(this.apiUrl.auth('login'), {
        email: request.email,
        password: request.password,
      })
      .pipe(
        map((response) => this.toSession(response, request.rememberMe)),
        tap((session) => {
          this.setSession(session);
          this.notifications.success('Welcome back.');
          void this.router.navigate(['/dashboard']);
        }),
      );
  }

  logout(revokeToken = true, message = 'You have been signed out.'): void {
    const current = this.session();
    if (revokeToken && current) {
      this.http
        .post(this.apiUrl.auth('revoke-token'), {})
        .pipe(catchError(() => of(null)))
        .subscribe();
    }

    this.clearSession();
    this.notifications.info(message);
    void this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthSession> {
    const current = this.session();
    if (!current) {
      return throwError(() => new Error('No active session.'));
    }

    if (!this.refreshRequest$) {
      const payload: RefreshTokenRequest = {
        accessToken: current.accessToken,
        refreshToken: current.refreshToken,
      };

      this.refreshRequest$ = this.http.post<AuthResponse>(this.apiUrl.auth('refresh-token'), payload).pipe(
        map((response) => this.toSession(response, current.rememberMe)),
        tap((session) => this.setSession(session)),
        shareReplay(1),
        finalize(() => {
          this.refreshRequest$ = undefined;
        }),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        }),
      );
    }

    return this.refreshRequest$;
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl.auth('change-password'), request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl.auth('forgot-password'), request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl.auth('reset-password'), request);
  }

  setLanguage(language: string): void {
    window.localStorage.setItem(STORAGE_KEYS.language, language);
  }

  private setSession(session: AuthSession): void {
    this.session.set(session);
    this.tokenStorage.saveSession(session);
    this.scheduleRefresh(session);
    this.idleTimeout.start();
  }

  private clearSession(): void {
    this.session.set(null);
    this.tokenStorage.clear();
    this.clearRefreshTimer();
    this.idleTimeout.stop();
  }

  private scheduleRefresh(session: AuthSession): void {
    this.clearRefreshTimer();
    const expiresAt = new Date(session.expiresAt).getTime();
    const refreshIn = Math.max(0, expiresAt - Date.now() - environment.refreshOffsetSeconds * 1000);
    this.refreshTimeoutId = window.setTimeout(() => {
      this.refreshToken().subscribe({
        error: () => this.logout(false, 'Your session expired. Please sign in again.'),
      });
    }, refreshIn);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimeoutId !== null) {
      window.clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
  }

  private toSession(response: AuthResponse, rememberMe: boolean): AuthSession {
    return {
      ...response,
      rememberMe,
      permissions: response.permissions ?? [],
    };
  }

  private isExpired(session: AuthSession): boolean {
    return new Date(session.expiresAt).getTime() <= Date.now();
  }
}
