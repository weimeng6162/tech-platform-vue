<template>
  <div class="demo-container">
    <h1>动画效果演示</h1>

    <!-- 滚动动画演示 -->
    <section class="demo-section">
      <h2>滚动动画</h2>
      <div class="scroll-demo">
        <ScrollReveal animation="fade" :delay="0">
          <div class="demo-box">淡入效果</div>
        </ScrollReveal>
        <ScrollReveal animation="slide-up" :delay="100">
          <div class="demo-box">向上滑入</div>
        </ScrollReveal>
        <ScrollReveal animation="slide-left" :delay="200">
          <div class="demo-box">向左滑入</div>
        </ScrollReveal>
        <ScrollReveal animation="scale" :delay="300">
          <div class="demo-box">缩放效果</div>
        </ScrollReveal>
        <ScrollReveal animation="rotate" :delay="400">
          <div class="demo-box">旋转效果</div>
        </ScrollReveal>
      </div>
    </section>

    <!-- 按钮动画演示 -->
    <section class="demo-section">
      <h2>按钮动画</h2>
      <div class="button-demo">
        <AnimatedButton variant="primary" @click="handleButtonClick">
          主要按钮
        </AnimatedButton>
        <AnimatedButton variant="secondary" @click="handleButtonClick">
          次要按钮
        </AnimatedButton>
        <AnimatedButton variant="ghost" @click="handleButtonClick">
          幽灵按钮
        </AnimatedButton>
        <AnimatedButton variant="danger" @click="handleButtonClick">
          危险按钮
        </AnimatedButton>
        <AnimatedButton variant="primary" :loading="loading" @click="handleLoadingClick">
          加载按钮
        </AnimatedButton>
      </div>
    </section>

    <!-- 骨架屏演示 -->
    <section class="demo-section">
      <h2>骨架屏</h2>
      <div class="skeleton-demo">
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
      </div>
    </section>

    <!-- 通知演示 -->
    <section class="demo-section">
      <h2>通知提示</h2>
      <div class="notification-demo">
        <AnimatedButton variant="primary" @click="showSuccess">
          成功通知
        </AnimatedButton>
        <AnimatedButton variant="danger" @click="showError">
          错误通知
        </AnimatedButton>
        <AnimatedButton variant="secondary" @click="showWarning">
          警告通知
        </AnimatedButton>
        <AnimatedButton variant="ghost" @click="showInfo">
          信息通知
        </AnimatedButton>
      </div>
    </section>

    <!-- 工具提示演示 -->
    <section class="demo-section">
      <h2>工具提示</h2>
      <div class="tooltip-demo">
        <Tooltip position="top">
          <template #trigger>
            <AnimatedButton variant="secondary">上方提示</AnimatedButton>
          </template>
          这是上方工具提示
        </Tooltip>
        <Tooltip position="bottom">
          <template #trigger>
            <AnimatedButton variant="secondary">下方提示</AnimatedButton>
          </template>
          这是下方工具提示
        </Tooltip>
        <Tooltip position="left">
          <template #trigger>
            <AnimatedButton variant="secondary">左侧提示</AnimatedButton>
          </template>
          这是左侧工具提示
        </Tooltip>
        <Tooltip position="right">
          <template #trigger>
            <AnimatedButton variant="secondary">右侧提示</AnimatedButton>
          </template>
          这是右侧工具提示
        </Tooltip>
      </div>
    </section>

    <!-- 通知容器 -->
    <NotificationContainer position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScrollReveal from '../components/ScrollReveal.vue'
import AnimatedButton from '../components/AnimatedButton.vue'
import ArticleCardSkeleton from '../components/ArticleCardSkeleton.vue'
import Tooltip from '../components/Tooltip.vue'
import NotificationContainer from '../components/NotificationContainer.vue'
import { useNotification } from '../composables/useNotification'

const loading = ref(false)
const { success, error, warning, info } = useNotification()

const handleButtonClick = () => {
  success('按钮点击', '你点击了一个按钮!')
}

const handleLoadingClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    success('加载完成', '数据已成功加载!')
  }, 2000)
}

const showSuccess = () => {
  success('操作成功', '你的操作已成功完成!')
}

const showError = () => {
  error('操作失败', '抱歉,出现了一些问题!')
}

const showWarning = () => {
  warning('警告提示', '请注意这个重要信息!')
}

const showInfo = () => {
  info('信息提示', '这是一条普通的信息通知!')
}
</script>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl);
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-3xl);
  text-align: center;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-section {
  margin-bottom: var(--space-3xl);
}

.demo-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
}

.scroll-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.demo-box {
  padding: var(--space-xl);
  background: var(--accent-gradient);
  border-radius: var(--radius-lg);
  color: white;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.button-demo,
.notification-demo,
.tooltip-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.skeleton-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}
</style>
