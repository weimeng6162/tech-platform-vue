<template>
  <div class="asset-tabs">
    <div class="tab-header">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        <component :is="tab.icon" :size="16" />
        <span>{{ tab.label }}</span>
        <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <div class="tab-content">
      <div v-if="loading" class="tab-loading">
        <div class="skeleton-item" v-for="i in 3" :key="i">
          <div class="skeleton-line w-60" />
          <div class="skeleton-line w-40" />
          <div class="skeleton-line w-80" />
        </div>
      </div>

      <div v-else-if="!items.length" class="tab-empty">
        <Inbox :size="36" />
        <span>暂无数据</span>
      </div>

      <template v-else>
        <article
          v-for="(item, idx) in items"
          :key="item.article_id"
          class="list-card"
          :style="{ animationDelay: `${idx * 0.06}s` }"
          @click="goToArticle(item.article_id)"
        >
          <div class="list-card-body">
            <div class="list-card-main">
              <h4 class="list-card-title">{{ item.title }}</h4>
              <p class="list-card-meta">
                <span class="meta-author">{{ item.author }}</span>
                <span class="meta-sep">·</span>
                <span>{{ item.category }}</span>
                <span class="meta-sep">·</span>
                <span>{{ formatRelativeTime(item.publish_time) }}</span>
              </p>
              <div class="list-card-tags">
                <span
                  v-for="tag in item.tags?.slice(0, 3)"
                  :key="tag"
                  class="list-tag"
                >{{ tag }}</span>
              </div>
            </div>
            <div class="list-card-stat">
              <Eye :size="14" />
              <span>{{ item.view_count }}</span>
            </div>
          </div>
        </article>

        <div v-if="hasMore" class="load-more" ref="loadMoreRef">
          <span v-if="loadingMore">加载中...</span>
          <button v-else class="load-more-btn" @click="loadMore">加载更多</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRelativeTime } from '../utils/formatTime'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Footprints, Bookmark, Eye, Inbox } from 'lucide-vue-next'
import { getFootprint, getCollections } from '../api/modules/user'
import type { HistoryItem, CollectionItem } from '../api/types'

const props = defineProps<{ linkFrom?: string }>()

type TabKey = 'footprint' | 'collections'

interface Tab {
  key: TabKey
  label: string
  icon: typeof Footprints
  count: number
}

const tabs: Tab[] = [
  { key: 'footprint', label: '足迹', icon: Footprints, count: 0 },
  { key: 'collections', label: '收藏', icon: Bookmark, count: 0 },
]

type ListItem = (HistoryItem | CollectionItem) & { article_id: string; title: string; author: string; publish_time: string; category: string; tags: string[]; view_count: number }

const activeTab = ref<TabKey>('footprint')
const items = ref<ListItem[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const page = ref(1)
const total = ref(0)
const hasMore = ref(false)
const loadMoreRef = ref<HTMLElement>()
const router = useRouter()

function goToArticle(articleId: string) {
  const path = `/article/${articleId}`
  if (props.linkFrom) {
    router.push({ path, query: { from: props.linkFrom } })
  } else {
    router.push(path)
  }
}

const PAGE_SIZE = 10


function getLocalFootprint(): ListItem[] {
  try {
    const raw = localStorage.getItem('recent-articles')
    if (!raw) return []
    const articles = JSON.parse(raw)
    return (articles as any[]).slice(0, 10).map((a: any) => ({
      article_id: a.article_id,
      title: a.title,
      author: a.author,
      publish_time: a.publish_time || a.createdAt || new Date().toISOString(),
      category: a.category || '',
      tags: Array.isArray(a.tags) ? a.tags : [],
      view_count: a.view_count || a.readCount || 0,
    })) as ListItem[]
  } catch {
    return []
  }
}

async function fetchData(tab: TabKey, pageNum: number, append: boolean) {
  const fetcher = tab === 'footprint' ? getFootprint : getCollections
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const res = await fetcher(pageNum, PAGE_SIZE) as { total: number; list: ListItem[] }
    const list = res.list ?? []
    if (list.length > 0) {
      total.value = res.total ?? 0
      hasMore.value = list.length === PAGE_SIZE
      if (append) { items.value.push(...list) } else { items.value = list }
    } else if (tab === 'footprint' && !append) {
      const local = getLocalFootprint()
      items.value = local
      total.value = local.length
      hasMore.value = false
    } else {
      if (!append) items.value = []
      hasMore.value = false
    }
  } catch {
    const localFoot = tab === 'footprint' && !append ? getLocalFootprint() : []
    if (localFoot.length) { items.value = localFoot; total.value = localFoot.length }
    else { if (!append) items.value = []; hasMore.value = false }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function switchTab(tab: TabKey) {
  if (activeTab.value === tab) return
  activeTab.value = tab
  page.value = 1
  items.value = []
  await fetchData(tab, 1, false)
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  page.value++
  await fetchData(activeTab.value, page.value, true)
}

// IntersectionObserver for infinite scroll
let observer: IntersectionObserver | null = null

onMounted(() => {
  fetchData(activeTab.value, 1, false)

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && hasMore.value && !loadingMore.value) {
        loadMore()
      }
    },
    { threshold: 0.1 }
  )
})

watch(loadMoreRef, (el) => {
  if (observer && el) {
    observer.disconnect()
    observer.observe(el)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.asset-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.tab-header {
  display: flex;
  gap: var(--space-xs);
  padding: 4px;
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 10px var(--space-md);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: rgba(99, 102, 241, 0.08);
}

.tab-btn.active {
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.12);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.1);
}

.tab-count {
  font-size: 0.7rem;
  padding: 1px 6px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: var(--radius-full);
  color: var(--accent-primary);
}

.tab-content {
  min-height: 160px;
}

.tab-loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.skeleton-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--space-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
}

.skeleton-line {
  height: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  animation: shimmer 1.5s infinite;
}

:global([data-theme="light"]) .skeleton-line {
  background: rgba(0, 0, 0, 0.06);
}

.w-60 { width: 60%; }
.w-40 { width: 40%; }
.w-80 { width: 80%; }

@keyframes shimmer {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}

.tab-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-2xl) 0;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.list-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardIn 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes cardIn {
  to { opacity: 1; transform: translateY(0); }
  from { opacity: 0; transform: translateY(10px); }
}

.list-card:hover {
  border-color: var(--border-glow);
  box-shadow: var(--shadow-md), var(--shadow-glow);
  transform: translateY(-2px);
}

.list-card-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  gap: var(--space-md);
}

.list-card-main {
  flex: 1;
  min-width: 0;
}

.list-card-title {
  margin: 0 0 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-card:hover .list-card-title {
  color: var(--accent-primary);
}

.list-card-meta {
  margin: 0 0 6px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.meta-author { color: var(--text-secondary); }
.meta-sep { margin: 0 2px; }

.list-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.list-tag {
  display: inline-flex;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.08);
  border-radius: var(--radius-full);
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.list-card-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
  margin-top: 2px;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: var(--space-md) 0;
}

.load-more-btn {
  padding: 8px var(--space-xl);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.15);
}
</style>
