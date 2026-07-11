import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { AuthService } from '@core/authentication/auth';
import { GlobalErrorHandler } from '@core/configuration/global-error-handler';
import { STORAGE_KEYS } from '@core/constants/storage.constants';
import { authInterceptor } from '@core/interceptors/auth-interceptor';
import { loadingInterceptor } from '@core/interceptors/loading-interceptor';
import { ThemeService } from '@core/services/theme';
import { environment } from '@env/environment';

const initializeApp = (authService: AuthService, themeService: ThemeService, translateService: TranslateService) => {
  return () => {
    themeService.initialize();
    const language = window.localStorage.getItem(STORAGE_KEYS.language) ?? environment.defaultLanguage;
    translateService.addLangs(['en', 'es']);
    void translateService.setFallbackLang(environment.defaultLanguage);
    void translateService.use(language);
    authService.initialize();
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
      }),
      fallbackLang: environment.defaultLanguage,
      lang: environment.defaultLanguage,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService, ThemeService, TranslateService],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};
