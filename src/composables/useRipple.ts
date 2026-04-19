import { ref } from 'vue'

interface RippleOptions {
  duration?: number
  color?: string
}

export const useRipple = (options: RippleOptions = {}) => {
  const {
    duration = 600,
    color = 'rgba(255, 255, 255, 0.3)'
  } = options

  const ripples = ref<Array<{
    id: number
    x: number
    y: number
    size: number
  }>>([])

  let rippleId = 0

  const createRipple = (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const size = Math.max(rect.width, rect.height) * 2

    const id = rippleId++
    ripples.value.push({ id, x, y, size })

    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id)
    }, duration)
  }

  return {
    ripples,
    createRipple,
    rippleStyle: {
      position: 'absolute',
      borderRadius: '50%',
      transform: 'scale(0)',
      animation: `ripple ${duration}ms linear`,
      backgroundColor: color,
      pointerEvents: 'none',
    } as const
  }
}

// 添加全局样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}
