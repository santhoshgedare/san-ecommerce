import { Injectable, signal } from '@angular/core';

export interface AppErrorState {
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorStateService {
  readonly error = signal<AppErrorState>({
    title: 'Unexpected error',
    message: 'Something went wrong while processing your request.',
  });

  set(error: AppErrorState): void {
    this.error.set(error);
  }
}
