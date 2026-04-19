import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 页面切换动画组合式函数
 * 提供更流畅自然的页面切换体验
 */
export function usePageTransition() {
  const router = useRouter()
  const isTransitioning = ref(false)
  const transitionDirection = ref<'forward' | 'backward'>('forward')

  // 路由历史记录，用于判断前进/后退方向
  const routeHistory = ref<string[]>([])
  const maxHistoryLength = 10

  // 添加路由到历史记录
  const addToHistory = (path: string) => {
    // 避免重复添加相同路径
    if (routeHistory.value[routeHistory.value.length - 1] !== path) {
      routeHistory.value.push(path)
      // 限制历史记录长度
      if (routeHistory.value.length > maxHistoryLength) {
        routeHistory.value.shift()
      }
    }
  }

  // 判断路由方向
  const getDirection = (toPath: string, fromPath: string): 'forward' | 'backward' => {
    const toIndex = routeHistory.value.lastIndexOf(toPath)
    const fromIndex = routeHistory.value.lastIndexOf(fromPath)

    // 如果目标路径在历史记录中且索引小于当前路径，则为后退
    if (toIndex !== -1 && toIndex < fromIndex) {
      return 'backward'
    }

    return 'forward'
  }

  // 获取优化的过渡名称
  const getOptimizedTransition = (toPath: string, fromPath: string): string => {
    const direction = getDirection(toPath, fromPath)
    transitionDirection.value = direction

    // 根据方向返回不同的过渡效果
    if (direction === 'backward') {
      return 'slide-fade-back'
    }

    return 'slide-fade'
  }

  // 路由守卫
  const setupGuards = () => {
    router.beforeEach((to, from, next) => {
      isTransitioning.value = true

      // 添加当前路径到历史记录
      if (from.path !== '/') {
        addToHistory(from.path)
      }

      next()
    })

    router.afterEach((to) => {
      // 延迟重置过渡状态，确保动画完成
      setTimeout(() => {
        isTransitioning.value = false
      }, 500)
    })
  }

  // 预加载下一页资源
  const preloadNextPage = (path: string) => {
    // 使用 requestIdleCallback 在空闲时预加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // 预加载路由组件
        const route = router.resolve(path)
        if (route.matched.length > 0) {
          const component = route.matched[0].components?.default
          if (component && typeof component === 'function') {
            // 触发组件预加载
            component()
          }
        }
      })
    }
  }

  // 平滑滚动到顶部
  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  onMounted(() => {
    setupGuards()
    // 添加初始路径
    addToHistory(router.currentRoute.value.path)
  })

  onUnmounted(() => {
    routeHistory.value = []
  })

  return {
    isTransitioning,
    transitionDirection,
    getOptimizedTransition,
    preloadNextPage,
    smoothScrollToTop,
    addToHistory
  }
}

/**
 * 页面内容渐入动画
 * 用于页面内元素的渐进式显示
 */
export function useContentFadeIn(delay: number = 0) {
  const isVisible = ref(false)

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = true
    }, delay)
  })

  return {
    isVisible
  }
}
