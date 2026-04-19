import { ref, onMounted, onUnmounted } from 'vue'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options

  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isVisible,
    elementRef
  }
}

// 视差滚动效果
export const useParallax = (speed: number = 0.5) => {
  const offset = ref(0)
  const elementRef = ref<HTMLElement | null>(null)

  const handleScroll = () => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const scrolled = window.scrollY
    const elementTop = rect.top + scrolled
    const viewportHeight = window.innerHeight

    // 计算视差偏移
    if (rect.top < viewportHeight && rect.bottom > 0) {
      offset.value = (scrolled - elementTop + viewportHeight) * speed
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    offset,
    elementRef
  }
}

// 滚动进度
export const useScrollProgress = () => {
  const progress = ref(0)

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return progress
}

// 平滑滚动到元素
export const scrollToElement = (element: HTMLElement | string, offset: number = 0) => {
  const target = typeof element === 'string'
    ? document.querySelector(element)
    : element

  if (!target) return

  const top = target.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}
