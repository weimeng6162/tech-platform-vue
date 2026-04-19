<template>
  <div class="collection-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          我的收藏
        </h1>
        <p class="page-desc">收藏你喜欢的文章，随时回顾精彩内容</p>
      </div>

      <div v-if="collectedArticles.length === 0" class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2>暂无收藏文章</h2>
        <p>发现好文章就收藏起来吧！</p>
        <router-link to="/" class="explore-btn">去发现</router-link>
      </div>

      <div v-else class="articles-list">
        <div class="list-header">
          <span class="count">共 {{ collectedArticles.length }} 篇文章</span>
          <button class="clear-btn" @click="handleClear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            清空收藏
          </button>
        </div>

        <ArticleCardAI
          v-for="article in collectedArticles"
          :key="article.article_id"
          :article="article"
          @click="handleArticleClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ArticleCardAI from '../components/ArticleCardAI.vue'
import { useCollectedArticles } from '../stores/collectedArticles'
import type { ArticleItem } from '../types/api'

const router = useRouter()
const { collectedArticles, clearCollectedArticles } = useCollectedArticles()

const handleArticleClick = (article: ArticleItem) => {
  router.push({
    path: '/article-ai',
    query: { id: article.article_id }
  })
}

const handleClear = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    clearCollectedArticles()
  }
}
</script>

<style scoped>
.collection-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--bg-primary);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.page-title svg {
  color: #fbbf24;
}

.page-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state svg {
  color: var(--text-tertiary);
  margin-bottom: 2rem;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 600;
  transition: all 0.3s;
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(251, 191, 36, 0.3);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.count {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}
</style>
