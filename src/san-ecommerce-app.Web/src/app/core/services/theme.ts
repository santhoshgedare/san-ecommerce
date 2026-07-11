import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

import { STORAGE_KEYS } from '@core/constants/storage.constants';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly modeSignal = signal<ThemeMode>('light');
  readonly mode = computed(() => this.modeSignal());

  initialize(): void {
    const stored = window.localStorage.getItem(STORAGE_KEYS.themeMode);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.setMode((stored as ThemeMode | null) ?? preferred);
  }

  toggle(): void {
    this.setMode(this.modeSignal() === 'light' ? 'dark' : 'light');
  }

  setMode(mode: ThemeMode): void {
    this.modeSignal.set(mode);
    this.document.documentElement.classList.toggle('theme-dark', mode === 'dark');
    window.localStorage.setItem(STORAGE_KEYS.themeMode, mode);
  }
}
