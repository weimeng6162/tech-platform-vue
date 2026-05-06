<template>
  <aside class="left-sidebar">
    <div class="sidebar-content">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" stroke="url(#logoGradient)" stroke-width="2" fill="none" />
            <path d="M16 10L10 13.5V20.5L16 24L22 20.5V13.5L16 10Z" fill="url(#logoGradient)" />
            <defs>
              <linearGradient id="logoGradient" x1="2" y1="2" x2="30" y2="30">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">TechFlow</span>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <Home :size="20" />
          <span>首页</span>
        </router-link>
        
        <a class="nav-item" :class="{ active: route.path.startsWith('/article') }" @click="handleArticleClick">
          <FileText :size="20" />
          <span>文章</span>
        </a>
        
        <router-link to="/footprint" class="nav-item" :class="{ active: route.path === '/footprint' }">
          <Footprints :size="20" />
          <span>足迹</span>
        </router-link>
        
        <router-link to="/collection" class="nav-item" :class="{ active: route.path === '/collection' }">
          <Bookmark :size="20" />
          <span>收藏</span>
        </router-link>
        
        <router-link to="/interest" class="nav-item" :class="{ active: route.path === '/interest' }">
          <Settings :size="20" />
          <span>兴趣配置</span>
        </router-link>
      </nav>

      <!-- 热门标签 -->
      <div class="sidebar-section">
        <h3 class="section-title">
          <Hash :size="16" />
          热门标签
        </h3>
        <div class="tag-cloud">
          <span
            v-for="tag in techTags.slice(0, 12)"
            :key="tag.id"
            class="cloud-tag"
            :style="{ '--tag-color': tag.color }"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>

      <!-- 活跃作者 -->
      <div class="sidebar-section">
        <h3 class="section-title">
          <Users :size="16" />
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
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Home, FileText, Footprints, Bookmark, Settings, Hash, Users } from 'lucide-vue-next'
import { getRecentArticle } from '../stores/recentArticles'
import { techTags } from '../data/mockData'

const route = useRoute()
const router = useRouter()

const authors = [
  { name: '张三', bio: '前端工程师' },
  { name: '李四', bio: '后端开发者' },
  { name: '王五', bio: '全栈工程师' },
]

const handleArticleClick = () => {
  const recentArticle = getRecentArticle()
  
  if (recentArticle) {
    router.push({
      path: '/article-ai',
      query: { id: recentArticle.article_id }
    })
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.left-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: var(--bg-glass);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-right: 1px solid var(--border-primary);
  z-index: 50;
  transition: all 0.3s ease;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-lg);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  margin-bottom: var(--space-xl);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.logo:hover {
  background: var(--bg-tertiary);
}

.logo-icon {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
  transition: filter 0.3s ease;
}

.logo:hover .logo-icon {
  filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.5));
}

:global([data-theme="dark"]) .logo-icon {
  filter: drop-shadow(0 0 16px rgba(0, 242, 255, 0.6)) drop-shadow(0 0 8px rgba(112, 0, 255, 0.4));
}

:global([data-theme="dark"]) .logo:hover .logo-icon {
  filter: drop-shadow(0 0 24px rgba(0, 242, 255, 0.8)) drop-shadow(0 0 16px rgba(112, 0, 255, 0.6));
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.35rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-item:hover::before {
  height: 60%;
}

.nav-item.active {
  color: var(--accent-primary);
  background: var(--accent-glow);
}

.nav-item.active::before {
  height: 80%;
  box-shadow: 0 0 12px rgba(0, 242, 255, 0.6), 0 0 24px rgba(112, 0, 255, 0.4);
}

:global([data-theme="dark"]) .nav-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

:global([data-theme="dark"]) .nav-item.active {
  background: rgba(0, 242, 255, 0.15) !important;
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.1);
}

:global([data-theme="dark"]) .nav-item.active::before {
  box-shadow: 0 0 16px rgba(0, 242, 255, 0.8), 0 0 32px rgba(112, 0, 255, 0.5);
}

/* 侧边栏区块 */
.sidebar-section {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-primary);
}

:global([data-theme="dark"]) .sidebar-section {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.cloud-tag {
  padding: 4px var(--space-sm);
  font-size: 0.75rem;
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

/* 作者列表 */
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
}

.author-bio {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
