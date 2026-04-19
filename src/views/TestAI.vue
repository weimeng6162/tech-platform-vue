<template>
  <div class="test-ai-page">
    <div class="container">
      <h1 class="page-title">AI 功能测试页面</h1>

      <!-- 文章推荐列表测试 -->
      <section class="section">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          AI 推荐文章列表
        </h2>

        <!-- 测试报告 -->
        <TestReport :all-articles="allArticles" :displayed-articles="articles" />

        <!-- AI 过滤统计 -->
        <div class="filter-stats">
          <div class="stat-item">
            <span class="stat-label">原始文章数：</span>
            <span class="stat-value">{{ allArticles.length }}</span>
          </div>
          <div class="stat-item warning">
            <span class="stat-label">已过滤劣质文章：</span>
            <span class="stat-value">{{ blockedCount }}</span>
          </div>
          <div class="stat-item info">
            <span class="stat-label">含商业推广：</span>
            <span class="stat-value">{{ warningCount }}</span>
          </div>
          <div class="stat-item success">
            <span class="stat-label">最终展示：</span>
            <span class="stat-value">{{ articles.length }}</span>
          </div>
        </div>

        <div class="articles-grid">
          <ArticleCardAI
            v-for="article in articles"
            :key="article.article_id"
            :article="article"
            @click="handleArticleClick"
          />
        </div>
      </section>

      <!-- 用户画像测试 -->
      <section class="section">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="7" r="4" stroke-width="2" />
          </svg>
          用户 AI 画像
        </h2>
        <div class="profile-container">
          <UserProfileAI :profile="userProfile" />
        </div>
      </section>

      <!-- 原始数据展示 -->
      <section class="section">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline
              points="16 18 22 12 16 6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="8 6 2 12 8 18"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          原始数据
        </h2>
        <div class="data-preview">
          <div class="data-block">
            <h3>文章数据</h3>
            <pre>{{ JSON.stringify(articles, null, 2) }}</pre>
          </div>
          <div class="data-block">
            <h3>用户画像数据</h3>
            <pre>{{ JSON.stringify(userProfile, null, 2) }}</pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleCardAI from '../components/ArticleCardAI.vue'
import UserProfileAI from '../components/UserProfileAI.vue'
import SecurityWarning from '../components/SecurityWarning.vue'
import TestReport from '../components/TestReport.vue'
import { recommendArticlesData, userProfileData } from '../data/mockData'
import { processArticles, getSecurityStatus } from '../utils/articleFilter'
import type { ArticleItem } from '../types/api'

// 使用假数据并过滤劣质文章
const allArticles = recommendArticlesData.data.article_list
const articles = processArticles(allArticles)
const userProfile = userProfileData.data

// 统计信息
const blockedCount = allArticles.length - articles.length
const warningCount = articles.filter((a) => a.tags.includes('含商业推广')).length

// 处理文章点击
const handleArticleClick = (article: ArticleItem) => {
  console.log('点击文章:', article)
  alert(`点击了文章: ${article.title}`)
}
</script>

<style scoped>
.test-ai-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section {
  margin-bottom: 4rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

/* 过滤统计 */
.filter-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
}

.stat-item.warning {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.stat-item.info {
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.stat-item.success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-item.warning .stat-value {
  color: #ef4444;
}

.stat-item.info .stat-value {
  color: #f97316;
}

.stat-item.success .stat-value {
  color: #10b981;
}

/* 文章网格 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* 用户画像容器 */
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}

/* 数据预览 */
.data-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.data-block {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.data-block h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.data-block pre {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .data-preview {
    grid-template-columns: 1fr;
  }
}
</style>
