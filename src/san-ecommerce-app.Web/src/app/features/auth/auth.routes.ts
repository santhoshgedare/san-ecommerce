import { Routes } from '@angular/router';

import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { LoginPage } from './pages/login-page/login-page';
import { ResetPasswordPage } from './pages/reset-password-page/reset-password-page';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-password', component: ResetPasswordPage },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
