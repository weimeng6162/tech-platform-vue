import { ref, watch } from 'vue'

const refreshTrigger = ref(0)

export const useRefresh = () => {
  const triggerRefresh = () => {
    refreshTrigger.value++
  }

  const onRefresh = (callback: () => void) => {
    return watch(refreshTrigger, callback)
  }

  return {
    refreshTrigger,
    triggerRefresh,
    onRefresh
  }
}
