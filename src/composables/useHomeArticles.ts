import { ref, computed, watch, nextTick, onUnmounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommendArticles } from '../api/modules/article'
import { processArticles } from '../utils/articleFilter'
import { formatRelativeTime } from '../utils/formatTime'
import { techTags } from '../constants/techTags'
import { useRefresh } from './useRefresh'
import type { ArticleItem } from '../types/api'
import type { ArticleListItem } from '../api/types'

const PAGE_SIZE = 10

export function useHomeArticles(activeSection: Ref<string>) {
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const articles = ref<ArticleItem[]>([])
  const cursor = ref('')
  const hasMore = ref(true)
  const loadingMore = ref(false)
  const loadMoreTrigger = ref<HTMLElement>()
  const activeTags = ref<string[]>([])
  let observer: IntersectionObserver | null = null

  const userInterests = ref<string[]>([])
  try {
    const stored = localStorage.getItem('user_interests')
    if (stored) userInterests.value = JSON.parse(stored)
  } catch { /* ignore */ }

  const filteredArticles = computed(() => {
    const processed = processArticles(articles.value)
    if (activeSection.value === 'recommend' && userInterests.value.length > 0) {
      return processed
        .map(a => {
          const matchCount = a.tags.filter(t => {
            const lower = t.toLowerCase()
            return userInterests.value.some(id => {
              const tag = techTags.find(tt => tt.id === id)
              if (!tag) return lower === id.toLowerCase()
              return lower.includes(tag.name.toLowerCase()) || lower.includes(id.toLowerCase())
            })
          }).length
          return { article: a, matchCount }
        })
        .filter(({ matchCount }) => matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(({ article }) => article)
    }
    return processed
  })

  function normalizeArticles(list: ArticleListItem[]): ArticleItem[] {
    return list.map(a => ({
      ...a,
      tags: typeof a.tags === 'string'
        ? (a.tags as string).split(/[\s,，]+/).filter(Boolean)
        : a.tags
    })) as unknown as ArticleItem[]
  }

  async function loadArticles() {
    loading.value = true
    error.value = null
    try {
      const data = await getRecommendArticles(undefined, PAGE_SIZE)
      const seen = new Set<string>()
      const deduped = normalizeArticles(data.article_list).filter(a => {
        if (seen.has(a.article_id)) return false
        seen.add(a.article_id)
        return true
      })
      // 随机打乱首页文章顺序
      for (let i = deduped.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deduped[i], deduped[j]] = [deduped[j], deduped[i]]
      }
      articles.value = deduped
      cursor.value = data.next_cursor
      hasMore.value = data.has_more
    } catch (err: any) {
      error.value = err.message || '加载失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
      const data = await getRecommendArticles(cursor.value || undefined, PAGE_SIZE)
      const existing = new Set(articles.value.map(a => a.article_id))
      const fresh = normalizeArticles(data.article_list).filter(a => !existing.has(a.article_id))
      articles.value = [...articles.value, ...fresh]
      cursor.value = data.next_cursor
      hasMore.value = data.has_more
      // 防止兴趣过滤导致无限循环：已加载 50+ 篇但无匹配时停止
      if (articles.value.length >= 50 && filteredArticles.value.length === 0) {
        hasMore.value = false
      }
    } catch {
      // 静默失败
    } finally {
      loadingMore.value = false
    }
  }

  function setupObserver() {
    observer?.disconnect()
    if (!loadMoreTrigger.value) return
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(loadMoreTrigger.value)
  }

  watch(loading, (val) => {
    if (!val) nextTick(() => setupObserver())
  })

  watch([filteredArticles], () => {
    nextTick(() => setupObserver())
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  loadArticles()

  const { refreshTrigger } = useRefresh()
  watch(refreshTrigger, () => {
    loadArticles()
  })

  const hotArticles = computed(() => {
    return [...filteredArticles.value]
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 5)
  })

  const hotTags = computed(() => {
    const tagCountMap = new Map<string, number>()
    filteredArticles.value.forEach(article => {
      article.tags.forEach(tagId => {
        tagCountMap.set(tagId, (tagCountMap.get(tagId) || 0) + 1)
      })
    })
    return [...tagCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tagId]) => techTags.find(t => t.id === tagId))
      .filter((t): t is NonNullable<typeof t> => !!t)
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
    router.push({
      path: '/article-ai',
      query: { id: article.article_id }
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  const formatDate = formatRelativeTime

  return {
    loading,
    error,
    articles,
    cursor,
    hasMore,
    loadingMore,
    loadMoreTrigger,
    activeTags,
    filteredArticles,
    hotArticles,
    hotTags,
    loadArticles,
    handleTagClick,
    handleArticleClick,
    formatNumber,
    formatDate,
  }
}
