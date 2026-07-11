import { Injectable } from '@angular/core';

import { STORAGE_KEYS } from '@core/constants/storage.constants';
import { AuthSession } from '@core/models/auth.models';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getSession(): AuthSession | null {
    return this.read(window.localStorage) ?? this.read(window.sessionStorage);
  }

  saveSession(session: AuthSession): void {
    const primary = session.rememberMe ? window.localStorage : window.sessionStorage;
    const secondary = session.rememberMe ? window.sessionStorage : window.localStorage;
    primary.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    secondary.removeItem(STORAGE_KEYS.session);
  }

  clear(): void {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    window.sessionStorage.removeItem(STORAGE_KEYS.session);
  }

  private read(storage: Storage): AuthSession | null {
    const raw = storage.getItem(STORAGE_KEYS.session);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      storage.removeItem(STORAGE_KEYS.session);
      return null;
    }
  }
}
