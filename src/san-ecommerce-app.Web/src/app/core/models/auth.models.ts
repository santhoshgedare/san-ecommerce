export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions?: string[];
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthSession extends AuthResponse {
  rememberMe: boolean;
  permissions: string[];
}
