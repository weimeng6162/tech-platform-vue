<template>
  <div class="article-card-ai" :class="{ 'has-warning': hasWarning }" @click="handleClick">
    <!-- 商业推广警示标记 -->
    <div v-if="hasWarning" class="warning-indicator">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <line x1="12" y1="9" x2="12" y2="13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- 难度角标 -->
    <div class="difficulty-badge" :style="{ backgroundColor: difficultyColor }">
      {{ difficultyIcon }} {{ article.difficulty }}
    </div>

    <!-- 收藏标记 -->
    <div v-if="article.is_collected" class="collected-mark">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </div>

    <!-- 文章内容 -->
    <div class="card-content">
      <!-- 标题 -->
      <h3 class="title">{{ article.title }}</h3>

      <!-- AI 摘要 - 带闪光图标 -->
      <div class="ai-summary">
        <div class="ai-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="ai-label">AI</span>
        </div>
        <p class="summary-text">{{ article.ai_summary }}</p>
      </div>

      <!-- 标签 -->
      <div class="tags">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="tag"
          :class="{ 'warning-tag': tag === '含商业推广' }"
          :style="tag === '含商业推广' ? {} : { backgroundColor: getTagColor(tag) }"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 元信息 -->
      <div class="meta">
        <span class="author">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="7" r="4" stroke-width="2" />
          </svg>
          {{ article.author }}
        </span>
        <span class="category">{{ article.category }}</span>
        <span class="views">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke-width="2" />
          </svg>
          {{ formatViewCount(article.view_count) }}
        </span>
        <span class="time">{{ formatTime(article.publish_time) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleItem } from '../types/api'
import { hasCommercialContent } from '../types/api'

const props = defineProps<{
  article: ArticleItem
}>()

const emit = defineEmits<{
  click: [article: ArticleItem]
}>()

// 检查是否包含商业推广
const hasWarning = computed(() => hasCommercialContent(props.article.tags))

// 过滤掉安全标签，只显示技术标签
const displayTags = computed(() => {
  const securityTags = ['安全拦截', '提示词注入', '营销软文', '技术水文', '含商业推广']
  return props.article.tags.filter((tag) => !securityTags.includes(tag) || tag === '含商业推广')
})

// 难度颜色映射
const difficultyColorMap: Record<string, string> = {
  初级: '#52c41a',
  中级: '#1890ff',
  深度: '#722ed1',
}

// 难度图标映射
const difficultyIconMap: Record<string, string> = {
  初级: '🌱',
  中级: '⚡',
  深度: '🚀',
}

const difficultyColor = computed(() => difficultyColorMap[props.article.difficulty])
const difficultyIcon = computed(() => difficultyIconMap[props.article.difficulty])

// 标签颜色生成
const getTagColor = (tag: string) => {
  const colors = [
    'rgba(59, 130, 246, 0.1)',
    'rgba(16, 185, 129, 0.1)',
    'rgba(245, 158, 11, 0.1)',
    'rgba(239, 68, 68, 0.1)',
    'rgba(139, 92, 246, 0.1)',
    'rgba(236, 72, 153, 0.1)',
  ]
  const index = tag.charCodeAt(0) % colors.length
  return colors[index]
}

// 格式化阅读数
const formatViewCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count.toString()
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const handleClick = () => {
  emit('click', props.article)
}
</script>

<style scoped>
.article-card-ai {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.article-card-ai:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

/* 警示状态 - 橘红色边框 */
.article-card-ai.has-warning {
  border: 2px solid #f97316;
  background: linear-gradient(135deg, var(--bg-secondary), rgba(251, 146, 60, 0.03));
}

.article-card-ai.has-warning:hover {
  border-color: #f97316;
  box-shadow: 0 12px 24px rgba(249, 115, 22, 0.2);
}

/* 警示指示器 */
.warning-indicator {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f97316;
  border-radius: 50%;
  color: white;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
  animation: warning-pulse 2s ease-in-out infinite;
}

@keyframes warning-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 难度角标 */
.difficulty-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 收藏标记 */
.collected-mark {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #fbbf24;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3));
}

/* 有警示时，收藏标记位置调整 */
.has-warning .collected-mark {
  left: 3.5rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 标题 */
.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0;
  padding-right: 5rem; /* 为难度角标留空间 */
}

/* AI 摘要 */
.ai-summary {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}

.ai-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: #6366f1;
  flex-shrink: 0;
}

.ai-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.summary-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

/* 标签 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: transform 0.2s;
}

.tag:hover {
  transform: scale(1.05);
}

/* 警示标签 - 特殊样式 */
.tag.warning-tag {
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  animation: tag-glow 2s ease-in-out infinite;
}

@keyframes tag-glow {
  0%,
  100% {
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(249, 115, 22, 0.5);
  }
}

/* 元信息 */
.meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.author,
.views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.category {
  padding: 0.125rem 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 0.75rem;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .ai-summary {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  }

  .article-card-ai.has-warning {
    background: linear-gradient(135deg, var(--bg-secondary), rgba(251, 146, 60, 0.05));
  }
}
</style>
