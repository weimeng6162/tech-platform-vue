import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/tech-platform-vue/',
  server: {
    proxy: {
      '/api': {              // ← 改这里，从 /api/user 改成 /api
        target: 'http://8.156.93.58:8080',
        changeOrigin: true,
      }
    }
  }
})