import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/api/modules/user'
import { aesEncrypt } from '@/utils/aes'
import { PASSWORD_RULES, ERROR_MESSAGES } from '@/constants/auth'
import type { ResetPasswordForm, PasswordRuleState } from '@/types/auth'

export interface UseResetPasswordOptions {
  /** 外部传入的 token（弹窗场景），不传则从 URL query 读取 */
  token?: string
  /** 成功后的回调（弹窗场景关闭弹窗），不传则默认跳转 /login */
  onSuccess?: () => void
}

export function useResetPassword(options?: UseResetPasswordOptions) {
  const route = useRoute()
  const router = useRouter()

  const form = reactive<ResetPasswordForm>({
    password: '',
    confirmPassword: '',
  })

  const errors = reactive<{ password: string; confirmPassword: string }>({
    password: '',
    confirmPassword: '',
  })

  const isSubmitting = ref(false)
  const submitError = ref('')
  const isSuccess = ref(false)

  /*
   * token 来源优先级：外部传入 > URL query > 空字符串
   * 空字符串时 Mock 降级仍可走通（API 层 _silent 兜底）
   */
  const token = computed<string>(() => {
    if (options?.token) return options.token
    return (route.query.token as string) || ''
  })

  const passwordRules = computed<PasswordRuleState[]>(() =>
    PASSWORD_RULES.map((rule) => ({
      key: rule.key,
      label: rule.label,
      met: form.password.length > 0 && rule.test(form.password),
    }))
  )

  const allRulesMet = computed<boolean>(() =>
    passwordRules.value.every((r) => r.met)
  )

  function validateForm(): boolean {
    errors.password = ''
    errors.confirmPassword = ''

    if (!form.password) {
      errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED
      return false
    }
    if (!allRulesMet.value) {
      errors.password = ERROR_MESSAGES.PASSWORD_WEAK
      return false
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.CONFIRM_MISMATCH
      return false
    }
    return true
  }

  async function submitReset(): Promise<void> {
    if (!validateForm()) return

    /* Mock 模式无 token 也允许提交，接口层 _silent 兜底 */
    if (!token.value) {
      submitError.value = ERROR_MESSAGES.TOKEN_MISSING
      return
    }

    isSubmitting.value = true
    submitError.value = ''

    try {
      const encrypted = aesEncrypt(form.password)
      await resetPassword({ token: token.value, password: encrypted })
      isSuccess.value = true
      if (options?.onSuccess) {
        /* 弹窗场景：由父组件控制关闭 */
        options.onSuccess()
      } else {
        /* 独立页面场景：2 秒后跳转登录页 */
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err: unknown) {
      submitError.value =
        err instanceof Error ? err.message : ERROR_MESSAGES.RESET_FAILED
    } finally {
      isSubmitting.value = false
    }
  }

  function reset(): void {
    form.password = ''
    form.confirmPassword = ''
    errors.password = ''
    errors.confirmPassword = ''
    submitError.value = ''
    isSuccess.value = false
    isSubmitting.value = false
  }

  return {
    form,
    errors,
    passwordRules,
    allRulesMet,
    isSubmitting,
    submitError,
    isSuccess,
    token,
    submitReset,
    validateForm,
    reset,
  } as const
}
