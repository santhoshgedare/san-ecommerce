import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';

import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class IdleTimeoutService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly timeoutMs = environment.idleTimeoutMinutes * 60 * 1000;
  private readonly events = ['click', 'keydown', 'mousemove', 'touchstart'] as const;
  private idleTimerId: number | null = null;
  private listening = false;
  private onIdle?: () => void;
  private readonly boundReset = () => this.resetTimer();

  constructor() {
    this.destroyRef.onDestroy(() => this.stop());
  }

  register(onIdle: () => void): void {
    this.onIdle = onIdle;
  }

  start(): void {
    if (!this.listening) {
      this.events.forEach((eventName) =>
        this.document.addEventListener(eventName, this.boundReset, { passive: true }),
      );
      this.listening = true;
    }
    this.resetTimer();
  }

  stop(): void {
    this.clearTimer();
    if (this.listening) {
      this.events.forEach((eventName) =>
        this.document.removeEventListener(eventName, this.boundReset),
      );
      this.listening = false;
    }
  }

  private resetTimer(): void {
    this.clearTimer();
    this.idleTimerId = window.setTimeout(() => this.onIdle?.(), this.timeoutMs);
  }

  private clearTimer(): void {
    if (this.idleTimerId !== null) {
      window.clearTimeout(this.idleTimerId);
      this.idleTimerId = null;
    }
  }
}
