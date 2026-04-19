<template>
  <div class="container">
    <!-- 粒子背景 -->
    <ParticleBackground :particle-count="45" />
    
    <!-- 背景装饰 -->
    <div class="background">
      <div class="gradient-orb-1" />
      <div class="gradient-orb-2" />
      <div class="grid-pattern" />
    </div>

    <!-- 进度条 -->
    <div class="progress">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="progress-step"
        :class="{ active: index <= currentStep, completed: index < currentStep }"
      >
        <div class="progress-icon">
          <component :is="step.icon" :size="20" />
        </div>
        <span class="progress-label">{{ step.title }}</span>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="content">
      <!-- 欢迎步骤 -->
      <div v-if="currentStep === 0" class="step">
        <div class="welcome-icon">
          <Sparkles :size="48" />
        </div>
        <h1>定制你的技术世界</h1>
        <p>选择你感兴趣的技术领域，我们将为你推荐最相关的文章、项目和开发者。</p>
        <div class="welcome-stats">
          <div class="stat-item">
            <span class="stat-number">35+</span>
            <span class="stat-label">技术标签</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">1000+</span>
            <span class="stat-label">精选文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">活跃作者</span>
          </div>
        </div>
      </div>

      <!-- 主技术栈步骤 -->
      <div v-if="currentStep === 1" class="step">
        <h1>选择你的主技术栈</h1>
        <p class="subtitle">选择 1-3 个你最擅长或最想深入学习的技术领域</p>
        
        <div class="tag-grid">
          <div v-for="(tags, category) in groupedTags" :key="category" class="tag-group">
            <div class="group-header">
              <component :is="categoryIcons[category] || Code" :size="24" />
              <span>{{ categoryNames[category] || category }}</span>
            </div>
            <div class="tags">
              <button
                v-for="tag in tags"
                :key="tag.id"
                class="tag"
                :class="{ selected: primaryTags.includes(tag.id) }"
                :style="{ '--tag-color': tag.color }"
                @click="toggleTag(tag.id, true)"
              >
                <Check v-if="primaryTags.includes(tag.id)" :size="14" class="check-icon" />
                {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="selection-info">
          已选择 <strong>{{ primaryTags.length }}</strong>/3 个主技术栈
        </div>
      </div>

      <!-- 完成步骤 -->
      <div v-if="currentStep === 2" class="step">
        <div class="complete-icon">
          <Check :size="48" />
        </div>
        <h1>配置完成！</h1>
        <p>我们已经根据你的兴趣为你准备了个性化的内容推荐。开始探索吧！</p>
        
        <div class="selected-tags">
          <h3>你的技术画像</h3>
          <div class="selected-list">
            <span
              v-for="tagId in primaryTags"
              :key="tagId"
              class="selected-tag"
              :style="{ '--tag-color': getTagColor(tagId) }"
            >
              {{ getTagName(tagId) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="actions">
      <button class="skip-btn" @click="router.push('/')">跳过</button>
      <button v-if="currentStep > 0" class="back-btn" @click="currentStep--">上一步</button>
      <button class="next-btn" @click="handleNext">
        <span>{{ currentStep === steps.length - 1 ? '开始探索' : '下一步' }}</span>
        <ChevronRight :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ChevronRight, Sparkles, Target, Zap, Code, Database, Cloud, Cpu, Smartphone, Wrench } from 'lucide-vue-next'
import { techTags } from '../data/mockData'
import ParticleBackground from '../components/ParticleBackground.vue'

const router = useRouter()
const currentStep = ref(0)
const primaryTags = ref<string[]>([])

const steps = [
  { id: 'welcome', title: '欢迎', icon: (props: any) => h(Sparkles, props) },
  { id: 'primary', title: '主技术栈', icon: (props: any) => h(Target, props) },
  { id: 'complete', title: '完成', icon: (props: any) => h(Check, props) },
]

const categoryIcons: Record<string, any> = {
  frontend: (props: any) => h(Code, props),
  backend: (props: any) => h(Database, props),
  devops: (props: any) => h(Cloud, props),
  cloud: (props: any) => h(Cloud, props),
  database: (props: any) => h(Database, props),
  api: (props: any) => h(Zap, props),
  mobile: (props: any) => h(Smartphone, props),
  ai: (props: any) => h(Cpu, props),
  language: (props: any) => h(Code, props),
  tools: (props: any) => h(Wrench, props),
}

const categoryNames: Record<string, string> = {
  frontend: '前端开发',
  backend: '后端开发',
  devops: '运维部署',
  cloud: '云计算',
  database: '数据库',
  api: 'API 设计',
  mobile: '移动开发',
  ai: '人工智能',
  language: '编程语言',
  tools: '开发工具',
}

const groupedTags = computed(() => {
  const groups: Record<string, typeof techTags> = {}
  techTags.forEach(tag => {
    if (!groups[tag.category]) {
      groups[tag.category] = []
    }
    groups[tag.category].push(tag)
  })
  return groups
})

const toggleTag = (tagId: string, isPrimary: boolean = false) => {
  if (isPrimary) {
    if (primaryTags.value.includes(tagId)) {
      primaryTags.value = primaryTags.value.filter(t => t !== tagId)
    } else if (primaryTags.value.length < 3) {
      primaryTags.value.push(tagId)
    }
  }
}

const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    router.push('/')
  }
}

const getTagName = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.name || tagId
}

const getTagColor = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.color || '#6366f1'
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: var(--space-xl);
}

.background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.gradient-orb-1 {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
}

.gradient-orb-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-primary) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
  opacity: 0.5;
}

.progress {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

/* 无模糊效果 */

.progress-step {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-tertiary);
  transition: color var(--transition-base);
}

.progress-step.active {
  color: var(--text-primary);
}

.progress-step.completed {
  color: var(--accent-primary);
}

.progress-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.progress-step.active .progress-icon {
  background: var(--accent-glow);
  color: var(--accent-primary);
}

.progress-step.completed .progress-icon {
  background: var(--accent-gradient);
  color: white;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.content {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.step {
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.step h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.step p {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto var(--space-xl);
  line-height: 1.6;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-xl);
  background: var(--accent-gradient);
  border-radius: var(--radius-xl);
  color: white;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.welcome-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-2xl);
  margin-top: var(--space-2xl);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.tag-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-height: 50vh;
  overflow-y: auto;
  padding: var(--space-md);
  text-align: left;
}

.tag-group {
  padding: var(--space-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

/* 无模糊效果 */

.group-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
}

.group-header span {
  font-size: 0.875rem;
  font-weight: 600;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--tag-color, var(--text-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
}

.tag.selected {
  color: white;
  background: var(--tag-color, var(--accent-primary));
  border-color: var(--tag-color, var(--accent-primary));
}

.selection-info {
  margin-top: var(--space-lg);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.selection-info strong {
  color: var(--accent-primary);
}

.complete-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-xl);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: var(--radius-xl);
  color: white;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.selected-tags {
  margin-top: var(--space-xl);
  padding: var(--space-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  text-align: left;
}

/* 无模糊效果 */

.selected-tags h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.selected-tag {
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: white;
  background: var(--tag-color, var(--accent-primary));
  border-radius: var(--radius-full);
}

.actions {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-primary);
}

.skip-btn {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
}

.back-btn {
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.next-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-xl);
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

/* 深色模式样式 */
:global([data-theme="dark"]) .progress {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .tag-group {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .selected-tags {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .back-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .next-btn {
  box-shadow: 0 4px 24px rgba(129, 140, 248, 0.5);
}
</style>
