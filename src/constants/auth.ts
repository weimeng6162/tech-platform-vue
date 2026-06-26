export interface PasswordRule {
  key: string
  label: string
  test: (password: string) => boolean
}

export const FORGOT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const COUNTDOWN_SECONDS = 60

export const AUTO_CLOSE_DELAY = 3000

export const PASSWORD_RULES: PasswordRule[] = [
  { key: 'length', label: '至少8个字符', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', label: '包含大写字母', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: '包含小写字母', test: (p: string) => /[a-z]/.test(p) },
  { key: 'digit', label: '包含数字', test: (p: string) => /\d/.test(p) },
  { key: 'special', label: '包含特殊字符', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: '邮箱不能为空',
  EMAIL_INVALID: '请输入有效的邮箱地址',
  SEND_FAILED: '发送失败，请稍后重试',
  PASSWORD_REQUIRED: '请输入新密码',
  PASSWORD_WEAK: '密码不满足安全要求',
  CONFIRM_MISMATCH: '两次密码不一致',
  TOKEN_MISSING: '重置链接无效，请重新获取',
  RESET_FAILED: '重置密码失败，请稍后重试',
} as const
