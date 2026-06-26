export type ForgotPasswordState = 'idle' | 'sending' | 'sent' | 'error'

export interface PasswordRuleState {
  key: string
  label: string
  met: boolean
}

export interface ResetPasswordForm {
  password: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  expires_at: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}
