import { ref, onUnmounted } from 'vue'

export function useCountdown(seconds: number) {
  const countdown = ref(0)
  const isCounting = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function start(): void {
    if (isCounting.value) return
    countdown.value = seconds
    isCounting.value = true
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        stop()
      }
    }, 1000)
  }

  function stop(): void {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
    isCounting.value = false
    countdown.value = 0
  }

  function reset(): void {
    stop()
  }

  onUnmounted(() => stop())

  return { countdown, isCounting, start, reset } as const
}
