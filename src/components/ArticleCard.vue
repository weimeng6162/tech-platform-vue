<template>
  <article class="card" :style="{ animationDelay: `${index * 0.1}s` }" @click="handleClick">
    <!-- 封面图区域 -->
    <div class="cover">
      <div class="cover-gradient" />
      <div class="cover-pattern" />
      <div class="cover-shine" />
      <!-- 难度角标 -->
      <span class="difficulty" :class="`difficulty--${difficultyClass}`">
        {{ article.difficulty }}
      </span>
      <!-- 收藏状态 -->
      <span v-if="article.is_collected" class="collected">
        <Bookmark :size="12" />
      </span>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 标题 -->
      <h3 class="title">{{ article.title }}</h3>

      <!-- AI摘要 -->
      <AISummary :summary="article.ai_summary" />

      <!-- 标签 -->
      <div class="tags">
        <span
          v-for="(tag, index) in article.tags"
          :key="index"
          class="tag"
          :style="{ '--tag-color': getTagColor(tag) }"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="footer">
        <!-- 作者 -->
        <div class="author">
          <div class="avatar">{{ article.author[0] }}</div>
          <span class="name">{{ article.author }}</span>
        </div>

        <!-- 统计 -->
        <div class="stats">
          <span class="stat">
            <Eye :size="14" />
            {{ formatNumber(article.view_count) }}
          </span>
        </div>

        <!-- 时间 -->
        <div class="time">
          <Clock :size="14" />
          <span>{{ formatDate(article.publish_time) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, Clock, Bookmark } from 'lucide-vue-next';
import AISummary from './AISummary.vue';
import type { ArticleListItem } from '../api/types';

const props = defineProps<{
  article: ArticleListItem;
  index: number;
}>();

const router = useRouter();

// 难度样式类
const difficultyClass = computed(() => {
  switch (props.article.difficulty) {
    case '初级':
      return 'beginner';
    case '中级':
      return 'intermediate';
    case '深度':
      return 'advanced';
    default:
      return 'beginner';
  }
});

// 标签颜色映射
const tagColorMap: Record<string, string> = {
  'Go': '#00ADD8',
  'Python': '#3776AB',
  'Java': '#ED8B00',
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'Vue': '#4FC08D',
  'React': '#61DAFB',
  'Docker': '#2496ED',
  'Kubernetes': '#326CE5',
  '并发编程': '#FF6B6B',
  'Goroutine': '#00ADD8',
  '底层原理': '#9B59B6',
  'Nginx': '#009639',
  'CI/CD': '#FF9500',
  '微服务': '#E74C3C'
};

const getTagColor = (tag: string) => {
  return tagColorMap[tag] || '#6366f1';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  if (diff < 7) return `${diff}天前`;
  if (diff < 30) return `${Math.floor(diff / 7)}周前`;
  return date.toLocaleDateString('zh-CN');
};

const formatNumber = (num: number) => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

const handleClick = () => {
  router.push(`/article/${props.article.article_id}`);
};
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
  position: relative;
}

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

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  border-color: var(--border-glow);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translateY(-8px) scale(1.02);
}

:global([data-theme="dark"]) .card {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .card::before {
  background: linear-gradient(135deg, transparent 0%, rgba(129, 140, 248, 0.1) 100%);
}

:global([data-theme="dark"]) .card:hover {
  border-color: rgba(129, 140, 248, 0.5);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(129, 140, 248, 0.3);
}

.cover {
  position: relative;
  height: 120px;
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

/* 难度角标 */
.difficulty {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

.difficulty--beginner {
  background: rgba(34, 197, 94, 0.9);
}

.difficulty--intermediate {
  background: rgba(59, 130, 246, 0.9);
}

.difficulty--advanced {
  background: rgba(147, 51, 234, 0.9);
}

/* 收藏状态 */
.collected {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #F59E0B;
  background: rgba(245, 158, 11, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(8px);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
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
  gap: 12px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--border-primary);
}

:global([data-theme="dark"]) .footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.author {
  display: flex;
  align-items: center;
  gap: 6px;
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
  gap: 8px;
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
