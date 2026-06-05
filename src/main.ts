import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// 隐藏首屏加载指示器
const loader = document.getElementById('app-loader')
if (loader) {
  loader.classList.add('hidden')
  setTimeout(() => loader.remove(), 300)
}
