import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/tech-platform-vue/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          // 将 highlight.js 单独分包（体积大且可按需加载）
          if (id.includes('highlight.js')) return 'vendor-highlight'
          // 将 marked 单独分包
          if (id.includes('marked')) return 'vendor-marked'
          // 将 crypto-js 单独分包
          if (id.includes('crypto-js')) return 'vendor-crypto'
          // 将 lucide 图标合并为一个 chunk
          if (id.includes('lucide')) return 'vendor-lucide'
          // Vue 核心
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/')) return 'vendor-vue'
          // Vue 生态（router, pinia）
          if (id.includes('vue-router') || id.includes('pinia')) return 'vendor-vue-eco'
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {              // ← 改这里，从 /api/user 改成 /api
        target: 'http://8.156.93.58:8080',
        changeOrigin: true,
      },
      '/api/articles': {
        target: 'http://8.156.93.58:8080',
        changeOrigin: true,
      },
    },
  },
})
