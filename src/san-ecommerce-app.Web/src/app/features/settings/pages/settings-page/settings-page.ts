import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from '@core/services/notification';
import { ThemeService } from '@core/services/theme';
import { PageHeader } from '@shared/components/page-header/page-header';
import { MATERIAL_IMPORTS, SHARED_IMPORTS } from '@shared/material/material-imports';

@Component({
  selector: 'app-settings-page',
  imports: [PageHeader, SHARED_IMPORTS, MATERIAL_IMPORTS],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  readonly themeService = inject(ThemeService);
  readonly form = this.formBuilder.nonNullable.group({
    language: ['en'],
    darkMode: [false],
    notifyProduct: [true],
    notifySecurity: [true],
    maintenanceDate: [new Date()],
  });

  save(): void {
    const { language, darkMode } = this.form.getRawValue();
    this.themeService.setMode(darkMode ? 'dark' : 'light');
    void this.translate.use(language);
    window.localStorage.setItem('san-ecommerce.language', language);
    this.notifications.success('Preferences saved.');
  }
}
