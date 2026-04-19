<template>
  <article class="card" :style="{ animationDelay: `${index * 0.1}s` }">
    <!-- 封面图区域 -->
    <div class="cover">
      <div class="cover-gradient" />
      <div class="cover-pattern" />
      <div class="cover-shine" />
      <span v-if="article.isFeatured" class="featured">
        <Star :size="12" />
        精选
      </span>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 标题 -->
      <h3 class="title">{{ article.title }}</h3>

      <!-- 摘要 -->
      <p class="summary">{{ article.summary }}</p>

      <!-- 标签 -->
      <div class="tags">
        <span
          v-for="tagId in article.tags"
          :key="tagId"
          class="tag"
          :style="{ '--tag-color': getTagColor(tagId) }"
        >
          {{ getTagName(tagId) }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="footer">
        <!-- 作者 -->
        <div class="author">
          <div class="avatar">{{ article.author.name[0] }}</div>
          <span class="name">{{ article.author.name }}</span>
        </div>

        <!-- 统计 -->
        <div class="stats">
          <span class="stat">
            <Eye :size="14" />
            {{ formatNumber(article.readCount) }}
          </span>
          <span class="stat">
            <Heart :size="14" />
            {{ formatNumber(article.likeCount) }}
          </span>
        </div>

        <!-- 时间 -->
        <div class="time">
          <Clock :size="14" />
          <span>{{ formatDate(article.createdAt) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Eye, Heart, Clock, Star } from 'lucide-vue-next'
import { techTags } from '../data/mockData'

interface Article {
  id: string
  title: string
  summary: string
  tags: string[]
  author: { name: string; avatar: string }
  readCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  isFeatured: boolean
  category: string
}

const props = defineProps<{
  article: Article
  index: number
}>()

const getTagName = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.name || tagId
}

const getTagColor = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.color || '#6366f1'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff}天前`
  return dateStr
}

const formatNumber = (num: number) => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

/* 无模糊效果 */

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.card:hover {
  border-color: var(--border-glow);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translateY(-6px);
}

/* 深色模式卡片增强 */
:global([data-theme="dark"]) .card {
  background: #020204;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .card:hover {
  border-color: rgba(129, 140, 248, 0.5);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(129, 140, 248, 0.3);
}

.cover {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.cover-gradient {
  position: absolute;
  inset: 0;
  background: var(--accent-gradient);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.card:hover .cover-gradient {
  opacity: 0.9;
}

:global([data-theme="dark"]) .cover-gradient {
  opacity: 0.5;
}

:global([data-theme="dark"]) .card:hover .cover-gradient {
  opacity: 0.7;
}

.cover-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  opacity: 0.6;
}

.cover-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.1) 45%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 55%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.card:hover .cover-shine {
  transform: translateX(100%);
}

.featured {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px var(--space-sm);
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 无模糊效果 */

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  transition: color var(--transition-fast);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;
}

.card:hover .title {
  color: var(--accent-primary);
}

.summary {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--space-sm);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 12%, transparent);
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--tag-color, var(--accent-primary)) 25%, transparent);
  transition: all var(--transition-fast);
}

.tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  transform: scale(1.05);
}

:global([data-theme="dark"]) .tag {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 18%, transparent);
  border-color: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 35%, transparent);
}

.footer {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-primary);
}

:global([data-theme="dark"]) .footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.author {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
  min-width: 0;
}

.avatar {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

:global([data-theme="dark"]) .avatar {
  box-shadow: 0 2px 12px rgba(129, 140, 248, 0.5);
}

.name {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  transition: color var(--transition-fast);
}

.stat:hover {
  color: var(--accent-primary);
}

.time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-left: auto;
}
</style>
