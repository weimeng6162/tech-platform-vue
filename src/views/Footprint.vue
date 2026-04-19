<template>
  <div class="footprint-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          我的足迹
        </h1>
        <p class="page-desc">记录你的阅读历史，快速找到之前看过的文章</p>
      </div>

      <div v-if="recentArticles.length === 0" class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 6v6l4 2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2>暂无阅读记录</h2>
        <p>快去探索精彩的技术文章吧！</p>
        <router-link to="/" class="explore-btn">开始探索</router-link>
      </div>

      <div v-else class="articles-list">
        <div class="list-header">
          <span class="count">共 {{ recentArticles.length }} 篇文章</span>
          <button class="clear-btn" @click="handleClear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            清空记录
          </button>
        </div>

        <ArticleCardAI
          v-for="article in recentArticles"
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
import { useRecentArticles } from '../stores/recentArticles'
import type { ArticleItem } from '../types/api'

const router = useRouter()
const { recentArticles, clearRecentArticles } = useRecentArticles()

const handleArticleClick = (article: ArticleItem) => {
  router.push({
    path: '/article-ai',
    query: { id: article.article_id }
  })
}

const handleClear = () => {
  if (confirm('确定要清空所有阅读记录吗？')) {
    clearRecentArticles()
  }
}
</script>

<style scoped>
.footprint-page {
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
  color: var(--primary-color);
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
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 600;
  transition: all 0.3s;
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
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
