import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '@core/authentication/auth';
import { STORAGE_KEYS } from '@core/constants/storage.constants';
import { NavigationService } from '@core/services/navigation';
import { ThemeService } from '@core/services/theme';
import { Avatar } from '@shared/components/avatar/avatar';
import { Breadcrumb } from '@shared/components/breadcrumb/breadcrumb';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar, Breadcrumb, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);

  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly navigationService = inject(NavigationService);
  readonly notifications = signal([
    '2 new user registrations pending approval.',
    'Quarterly sales snapshot is ready for export.',
    'Token rotation health check completed successfully.',
  ]);
  readonly isMobile = signal(false);
  readonly collapsed = signal(window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true');
  readonly sidenavOpened = signal(true);
  readonly currentYear = new Date().getFullYear();
  readonly userName = computed(() => this.authService.session()?.fullName ?? '');

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 960px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isMobile.set(matches);
        this.sidenavOpened.set(!matches);
      });
  }

  toggleSidenav(): void {
    if (this.isMobile()) {
      this.sidenavOpened.update((value) => !value);
      return;
    }

    const next = !this.collapsed();
    this.collapsed.set(next);
    window.localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(next));
  }

  changeLanguage(language: string): void {
    this.authService.setLanguage(language);
    void this.translateService.use(language);
  }

  logout(): void {
    this.authService.logout();
  }

  navigate(route: string): void {
    void this.router.navigateByUrl(route);
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }
}
