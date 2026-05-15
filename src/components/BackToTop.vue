<template>
  <transition name="fade">
    <div v-show="isVisible" class="floating-buttons">
      <!-- 刷新按钮 -->
      <button
        v-if="showRefresh"
        class="refresh-btn"
        @click="handleRefresh"
        title="刷新页面"
      >
        <RefreshCw :size="20" :class="{ 'spinning': isRefreshing }" />
      </button>
      
      <!-- 回到顶部按钮 -->
      <button
        class="back-to-top"
        @click="scrollToTop"
        title="回到顶部"
      >
        <ChevronUp :size="20" />
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUp, RefreshCw } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  threshold?: number
  showRefresh?: boolean
}>(), {
  threshold: 300,
  showRefresh: true
})

const isVisible = ref(false)
const isRefreshing = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > props.threshold
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const emit = defineEmits<{
  refresh: []
}>()

const handleRefresh = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  
  try {
    emit('refresh')
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    setTimeout(() => {
      isRefreshing.value = false
    }, 1000)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.floating-buttons {
  position: fixed;
  bottom: 2rem;
  right: calc(2rem + 260px);
  display: flex;
  gap: var(--space-sm);
  z-index: 1000;
}

.refresh-btn,
.back-to-top {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.refresh-btn:hover,
.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.6);
}

.refresh-btn:active,
.back-to-top:active {
  transform: translateY(-2px);
}

/* 刷新按钮旋转动画 */
.refresh-btn .spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Dark mode */
:global([data-theme="dark"]) .refresh-btn,
:global([data-theme="dark"]) .back-to-top {
  box-shadow: 0 4px 20px rgba(167, 139, 250, 0.6);
}

:global([data-theme="dark"]) .refresh-btn:hover,
:global([data-theme="dark"]) .back-to-top:hover {
  box-shadow: 0 8px 30px rgba(167, 139, 250, 0.8);
}
</style>
