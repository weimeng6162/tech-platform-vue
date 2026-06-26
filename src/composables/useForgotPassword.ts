import { ref, computed } from 'vue'
import { forgotPassword } from '@/api/modules/user'
import { useCountdown } from './useCountdown'
import {
  FORGOT_EMAIL_REGEX,
  COUNTDOWN_SECONDS,
  ERROR_MESSAGES,
} from '@/constants/auth'
import type { ForgotPasswordState } from '@/types/auth'

export function useForgotPassword() {
  const email = ref('')
  const state = ref<ForgotPasswordState>('idle')
  const errorMessage = ref('')
  const { countdown, isCounting, start: startCountdown, reset: resetCountdown } = useCountdown(COUNTDOWN_SECONDS)

  const isLoading = computed<boolean>(() => state.value === 'sending')
  const isSuccess = computed<boolean>(() => state.value === 'sent')
  const isError = computed<boolean>(() => state.value === 'error')

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      errorMessage.value = ERROR_MESSAGES.EMAIL_REQUIRED
      return false
    }
    if (!FORGOT_EMAIL_REGEX.test(value)) {
      errorMessage.value = ERROR_MESSAGES.EMAIL_INVALID
      return false
    }
    errorMessage.value = ''
    return true
  }

  function setError(message: string): void {
    errorMessage.value = message
    state.value = 'error'
  }

  async function sendResetLink(value: string): Promise<void> {
    email.value = value

    if (!validateEmail(value)) {
      state.value = 'error'
      return
    }

    state.value = 'sending'
    try {
      await forgotPassword({ email: value })
      state.value = 'sent'
      startCountdown()
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.SEND_FAILED
      setError(message)
    }
  }

  function reset(): void {
    state.value = 'idle'
    email.value = ''
    errorMessage.value = ''
    resetCountdown()
  }

  return {
    email,
    state,
    errorMessage,
    countdown,
    isCounting,
    isLoading,
    isSuccess,
    isError,
    sendResetLink,
    reset,
    validateEmail,
  } as const
}
