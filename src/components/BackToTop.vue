<template>
  <transition name="fade">
    <button
      v-show="isVisible"
      class="back-to-top"
      @click="scrollToTop"
    >
      <ChevronUp :size="20" />
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  threshold?: number
}>(), {
  threshold: 300
})

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > props.threshold
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.back-to-top:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.6);
}

.back-to-top:active {
  transform: translateY(-2px) scale(1.05);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Dark mode */
:global([data-theme="dark"]) .back-to-top {
  box-shadow: 0 4px 20px rgba(129, 140, 248, 0.6);
}

:global([data-theme="dark"]) .back-to-top:hover {
  box-shadow: 0 8px 30px rgba(129, 140, 248, 0.8);
}
</style>
