import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/tech-platform-vue/',
  server: {
    proxy: {
      '/api/user': {
        target: 'http://8.156.93.58:8080',
        changeOrigin: true
      }
    }
  }
})
