<template>
  <div class="container">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="router.back()">
      <ArrowLeft :size="20" />
      <span>返回</span>
    </button>

    <!-- 文章头部 -->
    <header class="header">
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

      <!-- 标题 -->
      <h1>{{ article.title }}</h1>

      <!-- 元信息 -->
      <div class="meta">
        <div class="author">
          <div class="avatar">{{ article.author.name[0] }}</div>
          <div class="author-info">
            <span class="author-name">{{ article.author.name }}</span>
            <span class="author-bio">{{ article.author.bio }}</span>
          </div>
        </div>
        <div class="stats">
          <span><Eye :size="16" />{{ formatNumber(article.readCount) }}</span>
          <span><Clock :size="16" />{{ article.readTime }}</span>
          <span>{{ article.createdAt }}</span>
        </div>
      </div>
    </header>

    <!-- 文章内容 -->
    <article class="content">
      <div v-html="renderedContent" class="markdown-body"></div>
    </article>

    <!-- 文章底部 -->
    <footer class="footer">
      <div class="actions">
        <button class="action-btn">
          <Heart :size="20" />
          <span>{{ formatNumber(article.likeCount) }}</span>
        </button>
        <button class="action-btn">
          <MessageCircle :size="20" />
          <span>{{ article.commentCount }}</span>
        </button>
        <button class="action-btn">
          <Bookmark :size="20" />
          <span>收藏</span>
        </button>
        <button class="action-btn">
          <Share2 :size="20" />
          <span>分享</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Eye, Clock, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-vue-next'
import { techTags, articleContent } from '../data/mockData'

const router = useRouter()

const article = {
  id: '1',
  title: '深入理解 Vue 3 的响应式原理',
  tags: ['vue', 'typescript', 'javascript'],
  author: { name: '张三', avatar: '', bio: '前端架构师，Vue 核心贡献者' },
  readCount: 12580,
  likeCount: 892,
  commentCount: 156,
  createdAt: '2024-01-15',
  readTime: '12 分钟',
}

const getTagName = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.name || tagId
}

const getTagColor = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.color || '#6366f1'
}

const formatNumber = (num: number) => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

// 简单的 Markdown 渲染
const renderedContent = computed(() => {
  let html = articleContent
  // 标题
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')
  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // 粗体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // 列表
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
  // 段落
  html = html.replace(/^(?!<[hupol]|<\/)(.*$)/gm, '<p>$1</p>')
  return html
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: var(--space-lg);
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--border-primary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 15%, transparent);
  border-radius: var(--radius-full);
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.author {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.author-bio {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.stats {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.stats span {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.content {
  padding: var(--space-xl) 0;
}

.markdown-body :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  margin: var(--space-2xl) 0 var(--space-lg);
  color: var(--text-primary);
}

.markdown-body :deep(h2) {
  font-size: 1.375rem;
  font-weight: 600;
  margin: var(--space-xl) 0 var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.markdown-body :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: var(--space-lg) 0 var(--space-sm);
  color: var(--text-primary);
}

.markdown-body :deep(p) {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
}

.markdown-body :deep(code) {
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--bg-tertiary);
  border-radius: 4px;
  color: var(--accent-primary);
}

.markdown-body :deep(pre) {
  margin: var(--space-lg) 0;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
}

.markdown-body :deep(ul) {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.markdown-body :deep(li) {
  margin: var(--space-sm) 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

.footer {
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-primary);
}

.actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  background: var(--accent-glow);
}

/* 深色模式样式 */
:global([data-theme="dark"]) .article {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .action-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .action-btn:hover {
  background: rgba(129, 140, 248, 0.2);
  border-color: rgba(129, 140, 248, 0.5);
}
</style>
