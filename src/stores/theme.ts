import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme: 'light' | 'dark' = 'light'
  const theme = ref<'light' | 'dark'>(defaultTheme)

  // 初始化主题
  try {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme.value = savedTheme
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
  } catch (e) {
    // ignore storage or matchMedia errors
  }

  document.documentElement.setAttribute('data-theme', theme.value)

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 设置主题
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  // 监听主题变化
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  })

  return {
    theme,
    toggleTheme,
    setTheme
  }
})
