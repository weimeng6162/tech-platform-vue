<template>
  <div class="container">
    <!-- 主内容区域 -->
    <div class="main-content">
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

      <!-- 热门标签 -->
      <section class="hero-tags-section">
        <div class="hero-tags">
          <span
            v-for="tag in techTags.slice(0, 7)"
            :key="tag.id"
            class="hero-tag"
            :class="{ active: activeTags.includes(tag.id) }"
            :style="{ '--tag-color': tag.color }"
            @click="handleTagClick(tag.id)"
          >
            {{ tag.name }}
          </span>
          <span
            class="hero-tag more-tag"
            :class="{ active: showMoreTags }"
            @click="showMoreTags = !showMoreTags"
          >
            更多
          </span>
        </div>

        <!-- 更多标签面板 -->
        <transition name="expand">
          <div v-if="showMoreTags" class="more-tags-panel">
            <div class="more-tags-grid">
              <span
                v-for="tag in techTags.slice(7)"
                :key="tag.id"
                class="hero-tag"
                :class="{ active: activeTags.includes(tag.id) }"
                :style="{ '--tag-color': tag.color }"
                @click="handleTagClick(tag.id)"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </transition>
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
    </div>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 热门标签 -->
      <div class="sidebar-card">
        <h3>
          <Hash :size="18" />
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
          <Users :size="18" />
          活跃作者
        </h3>
        <div class="authors">
          <div v-for="author in authors" :key="author.name" class="author">
            <div class="author-avatar">{{ author.name[0] }}</div>
            <div class="author-info">
              <span class="author-name">{{ author.name }}</span>
              <span class="author-bio">{{ author.bio }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Grid, BookOpen, Lightbulb, Award, Wrench, TrendingUp, MessageCircle, Sparkles, Hash, Users } from 'lucide-vue-next'
import ArticleCardAI from '../components/ArticleCardAI.vue'
import { recommendArticlesData, categories, techTags } from '../data/mockData'
import { processArticles } from '../utils/articleFilter'
import type { ArticleItem } from '../types/api'
import { useRefresh } from '../composables/useRefresh'

const router = useRouter()
const route = useRoute()
const activeCategory = ref('all')
const activeSection = ref<'featured' | 'recommend'>('featured')
const activeTags = ref<string[]>([])
const showMoreTags = ref(false)

const iconMap: Record<string, any> = {
  Grid: (props: any) => h(Grid, props),
  BookOpen: (props: any) => h(BookOpen, props),
  Lightbulb: (props: any) => h(Lightbulb, props),
  Award: (props: any) => h(Award, props),
  Wrench: (props: any) => h(Wrench, props),
  TrendingUp: (props: any) => h(TrendingUp, props),
  MessageCircle: (props: any) => h(MessageCircle, props),
}

const authors = [
  { name: '张三', bio: '前端工程师' },
  { name: '李四', bio: '后端开发者' },
  { name: '王五', bio: '全栈工程师' },
]

const allArticles = recommendArticlesData.data.article_list
const filteredArticles = processArticles(allArticles)

const shuffledArticles = ref<ArticleItem[]>([...filteredArticles])

const shuffleArticles = () => {
  const array = [...filteredArticles]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  shuffledArticles.value = array
}

const { refreshTrigger } = useRefresh()
watch(refreshTrigger, () => {
  shuffleArticles()
})

const currentArticles = computed(() => {
  let articles = shuffledArticles.value

  if (activeCategory.value !== 'all') {
    articles = articles
  }

  if (activeTags.value.length > 0) {
    articles = articles.filter(article => 
      activeTags.value.some(tag => article.tags.includes(tag))
    )
  }

  if (activeSection.value === 'featured') {
    return articles.slice(0, 6)
  } else {
    return articles.slice(6)
  }
})

const handleTagClick = (tagId: string) => {
  const index = activeTags.value.indexOf(tagId)
  if (index > -1) {
    activeTags.value.splice(index, 1)
  } else {
    activeTags.value.push(tagId)
  }
}

const handleArticleClick = (article: ArticleItem) => {
  console.log('点击文章:', article)
  router.push({
    path: '/article-ai',
    query: { id: article.article_id }
  })
}

defineExpose({
  shuffleArticles
})
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-xl);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* Hero 区域 */
.hero {
  grid-column: 1 / -1;
  position: relative;
  padding: var(--space-2xl) 0;
  text-align: center;
  overflow: hidden;
  min-height: 380px;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-orb-1 {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  max-width: 100%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  animation: orbFloat1 8s ease-in-out infinite;
}

.hero-orb-2 {
  position: absolute;
  bottom: -30%;
  left: 20%;
  width: 500px;
  height: 500px;
  max-width: 100%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
  animation: orbFloat2 10s ease-in-out infinite;
}

.hero-orb-3 {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 400px;
  height: 400px;
  max-width: 100%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: orbFloat3 12s ease-in-out infinite;
}

/* 深色模式 - 增强光晕 */
:global([data-theme="dark"]) .hero-orb-1 {
  background: radial-gradient(circle, rgba(0, 242, 255, 0.3) 0%, rgba(112, 0, 255, 0.15) 40%, transparent 70%);
  animation: orbFloat1 8s ease-in-out infinite, orbPulse 4s ease-in-out infinite;
}

:global([data-theme="dark"]) .hero-orb-2 {
  background: radial-gradient(circle, rgba(112, 0, 255, 0.25) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%);
}

:global([data-theme="dark"]) .hero-orb-3 {
  background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0, 242, 255, 0.08) 40%, transparent 70%);
}

@keyframes orbPulse {
  0%, 100% { opacity: 1; transform: translateX(-50%); }
  50% { opacity: 0.7; transform: translateX(-50%); }
}

@keyframes orbFloat1 {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
  50% { transform: translateX(-50%) translateY(-40px); opacity: 0.8; }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0); opacity: 1; }
  50% { transform: translate(30px, -30px); opacity: 0.7; }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0); opacity: 0.8; }
  50% { transform: translate(-20px, 20px); opacity: 1; }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.2rem;
  }
}

.gradient-text {
  display: block;
  background: linear-gradient(135deg, #00F2FF 0%, #7000FF 40%, #A855F7 70%, #00F2FF 100%);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textShine 4s linear infinite;
  position: relative;
}

:global([data-theme="dark"]) .gradient-text {
  text-shadow: 0 0 40px rgba(0, 242, 255, 0.4), 0 0 80px rgba(112, 0, 255, 0.2);
  filter: brightness(1.1);
}

@keyframes textShine {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

.hero-content p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

/* 热门标签区域 */
.hero-tags-section {
  margin-bottom: var(--space-md);
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

.hero-tag.active {
  background: var(--tag-color, var(--accent-primary));
  color: white;
  border-color: var(--tag-color, var(--accent-primary));
  box-shadow: 0 4px 12px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 40%, transparent);
  transform: translateY(-2px);
}

:global([data-theme="dark"]) .hero-tag {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 15%, transparent);
  border-color: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

:global([data-theme="dark"]) .hero-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 25%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 40%, transparent);
}

:global([data-theme="dark"]) .hero-tag.active {
  background: var(--tag-color, var(--accent-primary));
  color: white;
  border-color: var(--tag-color, var(--accent-primary));
  box-shadow: 0 4px 20px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 50%, transparent), 0 0 30px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

/* 更多标签样式 */
.more-tag {
  --tag-color: var(--accent-primary);
  background: transparent;
  border: 1px dashed var(--border-secondary);
  color: var(--text-secondary);
}

.more-tag:hover {
  background: var(--bg-tertiary);
  border-style: solid;
}

.more-tag.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  border-style: solid;
}

.more-tags-panel {
  margin-top: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.more-tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}

:global([data-theme="dark"]) .more-tags-panel {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}

/* 分类导航 */
.categories {
  grid-column: 1 / -1;
  margin-bottom: var(--space-md);
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
  gap: var(--space-xl);
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
  position: sticky;
  top: 120px;
  margin-top: 480px;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.sidebar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.sidebar-card:hover {
  border-color: var(--border-secondary);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.sidebar-card:hover::before {
  opacity: 1;
}

/* 深色模式 - 全息玻璃侧边栏 */
:global([data-theme="dark"]) .sidebar-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

:global([data-theme="dark"]) .sidebar-card::before {
  background: linear-gradient(90deg, transparent, #00F2FF, #7000FF, transparent);
  opacity: 0.5;
}

:global([data-theme="dark"]) .sidebar-card:hover {
  border-color: rgba(0, 242, 255, 0.2);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 242, 255, 0.1);
}

:global([data-theme="dark"]) .sidebar-card:hover::before {
  opacity: 1;
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
  justify-content: space-between;
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
  box-shadow: 0 2px 20px rgba(0, 242, 255, 0.5), 0 0 30px rgba(112, 0, 255, 0.3);
  animation: avatarGlow 3s ease-in-out infinite;
}

@keyframes avatarGlow {
  0%, 100% {
    box-shadow: 0 2px 20px rgba(0, 242, 255, 0.5), 0 0 30px rgba(112, 0, 255, 0.3);
  }
  50% {
    box-shadow: 0 2px 28px rgba(0, 242, 255, 0.7), 0 0 40px rgba(112, 0, 255, 0.5);
  }
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

.author-bio {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.author-stats {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.follow-btn {
  padding: var(--space-xs) var(--space-sm);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--accent-primary);
  background: transparent;
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.follow-btn:hover {
  background: var(--accent-primary);
  color: white;
}

:global([data-theme="dark"]) .follow-btn {
  border-color: rgba(0, 242, 255, 0.6);
  color: #00F2FF;
  text-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:global([data-theme="dark"]) .follow-btn:hover {
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.2), rgba(112, 0, 255, 0.2));
  border-color: #00F2FF;
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.5), inset 0 0 10px rgba(0, 242, 255, 0.1);
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>
