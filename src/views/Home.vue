<template>
  <div class="container">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-orb-1" />
        <div class="hero-orb-2" />
        <div class="hero-orb-3" />
      </div>
      <div class="hero-content">
        <h1>
          探索技术的
          <span class="gradient-text">无限可能</span>
        </h1>
        <p>汇聚前沿技术文章，助力开发者成长</p>
        <div class="hero-tags">
          <span
            v-for="tag in techTags.slice(0, 8)"
            :key="tag.id"
            class="hero-tag"
            :style="{ '--tag-color': tag.color }"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </section>

    <!-- 分类导航 -->
    <section class="categories">
      <div class="categories-wrapper">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <component :is="iconMap[cat.icon]" :size="18" />
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <!-- 内容区域 -->
    <main class="main">
      <!-- 热门精选 / 猜你喜欢 切换 -->
      <div class="section-tabs">
        <button
          class="section-tab"
          :class="{ active: activeSection === 'featured' }"
          @click="activeSection = 'featured'"
        >
          <TrendingUp :size="18" />
          <span>热门精选</span>
        </button>
        <button
          class="section-tab"
          :class="{ active: activeSection === 'recommend' }"
          @click="activeSection = 'recommend'"
        >
          <Sparkles :size="18" />
          <span>猜你喜欢</span>
        </button>
      </div>

      <!-- 文章列表 -->
      <div class="article-grid">
        <ArticleCardAI
          v-for="article in currentArticles"
          :key="article.article_id"
          :article="article"
          @click="handleArticleClick"
        />
      </div>
    </main>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 热门标签 -->
      <div class="sidebar-card">
        <h3>
          <Hash :size="16" />
          热门标签
        </h3>
        <div class="tag-cloud">
          <span
            v-for="tag in techTags.slice(0, 15)"
            :key="tag.id"
            class="cloud-tag"
            :style="{ '--tag-color': tag.color }"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>

      <!-- 活跃作者 -->
      <div class="sidebar-card">
        <h3>
          <Users :size="16" />
          活跃作者
        </h3>
        <div class="authors">
          <div v-for="name in ['张三', '李四', '王五', '赵六']" :key="name" class="author">
            <div class="author-avatar">{{ name[0] }}</div>
            <div class="author-info">
              <span class="author-name">{{ name }}</span>
              <span class="author-stats">{{ Math.floor(Math.random() * 100) }} 篇文章</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { Grid, BookOpen, Lightbulb, Award, Wrench, TrendingUp, MessageCircle, Sparkles, Hash, Users } from 'lucide-vue-next'
import ArticleCardAI from '../components/ArticleCardAI.vue'
import { recommendArticlesData, categories, techTags } from '../data/mockData'
import { processArticles } from '../utils/articleFilter'
import type { ArticleItem } from '../types/api'

const router = useRouter()
const activeCategory = ref('all')
const activeSection = ref<'featured' | 'recommend'>('featured')

const iconMap: Record<string, any> = {
  Grid: (props: any) => h(Grid, props),
  BookOpen: (props: any) => h(BookOpen, props),
  Lightbulb: (props: any) => h(Lightbulb, props),
  Award: (props: any) => h(Award, props),
  Wrench: (props: any) => h(Wrench, props),
  TrendingUp: (props: any) => h(TrendingUp, props),
  MessageCircle: (props: any) => h(MessageCircle, props),
}

// 使用新的 AI 推荐数据并过滤劣质文章
const allArticles = recommendArticlesData.data.article_list
const filteredArticles = processArticles(allArticles)

// 根据分类过滤文章
const currentArticles = computed(() => {
  let articles = filteredArticles

  // 根据分类过滤
  if (activeCategory.value !== 'all') {
    // 这里可以根据分类进行过滤，暂时显示所有文章
    articles = articles
  }

  // 根据热门精选/猜你喜欢过滤
  if (activeSection.value === 'featured') {
    // 显示前6篇作为热门精选
    return articles.slice(0, 6)
  } else {
    // 显示后面的作为猜你喜欢
    return articles.slice(6)
  }
})

// 处理文章点击
const handleArticleClick = (article: ArticleItem) => {
  console.log('点击文章:', article)
  // 跳转到文章详情页，传递文章 ID
  router.push({
    path: '/article-ai',
    query: { id: article.article_id }
  })
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* Hero 区域 */
.hero {
  grid-column: 1 / -1;
  position: relative;
  padding: var(--space-3xl) 0;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-orb-1 {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  animation: orbFloat1 8s ease-in-out infinite;
}

.hero-orb-2 {
  position: absolute;
  bottom: -30%;
  left: 20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
  animation: orbFloat2 10s ease-in-out infinite;
}

.hero-orb-3 {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: orbFloat3 12s ease-in-out infinite;
}

/* 深色模式增强 */
:global([data-theme="dark"]) .hero-orb-1 {
  background: radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 70%);
}

:global([data-theme="dark"]) .hero-orb-2 {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%);
}

:global([data-theme="dark"]) .hero-orb-3 {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
}

@keyframes orbFloat1 {
  0%, 100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
  50% { transform: translateX(-50%) translateY(-40px) scale(1.1); opacity: 0.8; }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
  50% { transform: translate(30px, -30px) scale(1.05); opacity: 0.7; }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
  50% { transform: translate(-20px, 20px) scale(1.1); opacity: 1; }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
}

.gradient-text {
  display: block;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

.hero-tag {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.hero-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

:global([data-theme="dark"]) .hero-tag {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 15%, transparent);
  border-color: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

:global([data-theme="dark"]) .hero-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 25%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 40%, transparent);
}

/* 分类导航 */
.categories {
  grid-column: 1 / -1;
  margin-bottom: var(--space-lg);
}

.categories-wrapper {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
  scrollbar-width: none;
}

.categories-wrapper::-webkit-scrollbar {
  display: none;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

/* 无模糊效果 */

.category-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-secondary);
  background: var(--bg-elevated);
}

.category-btn.active {
  color: white;
  background: var(--accent-gradient);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

:global([data-theme="dark"]) .category-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

:global([data-theme="dark"]) .category-btn.active {
  box-shadow: 0 4px 24px rgba(129, 140, 248, 0.5);
}

/* 主内容区 */
.main {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.section-tabs {
  display: flex;
  gap: var(--space-sm);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-primary);
}

.section-tab {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.section-tab:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.section-tab.active {
  color: var(--accent-primary);
  background: var(--accent-glow);
}

:global([data-theme="dark"]) .section-tab.active {
  background: rgba(129, 140, 248, 0.15);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}

.sidebar-card {
  padding: var(--space-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

/* 无模糊效果 */

.sidebar-card:hover {
  border-color: var(--border-secondary);
}

:global([data-theme="dark"]) .sidebar-card {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .sidebar-card:hover {
  border-color: rgba(129, 140, 248, 0.35);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
}

.sidebar-card h3 {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.cloud-tag {
  padding: 4px var(--space-sm);
  font-size: 0.8rem;
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 10%, transparent);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cloud-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  transform: scale(1.05);
}

:global([data-theme="dark"]) .cloud-tag {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 15%, transparent);
}

.authors {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.author {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.author:hover {
  background: var(--bg-tertiary);
}

:global([data-theme="dark"]) .author:hover {
  background: rgba(255, 255, 255, 0.05);
}

.author-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
}

:global([data-theme="dark"]) .author-avatar {
  box-shadow: 0 2px 16px rgba(129, 140, 248, 0.5);
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.author-stats {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
</style>
