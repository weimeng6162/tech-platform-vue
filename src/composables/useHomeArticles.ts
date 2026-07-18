import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommendArticles } from '../api/modules/article'
import { processArticles } from '../utils/articleFilter'
import { formatRelativeTime } from '../utils/formatTime'
import { techTags } from '../constants/techTags'
import { useRefresh } from './useRefresh'
import type { ArticleItem } from '../types/api'
import type { ArticleListItem } from '../api/types'

const PAGE_SIZE = 10

export function useHomeArticles() {
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const articles = ref<ArticleItem[]>([])
  const currentPage = ref(0)
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
    if (userInterests.value.length === 0) return processed
    return processed
      .map(a => {
        const matchCount = a.tags.filter(t => userInterests.value.includes(t)).length
        return { article: a, matchCount }
      })
      .filter(({ matchCount }) => matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(({ article }) => article)
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
      const list = await getRecommendArticles(1, PAGE_SIZE)
      articles.value = normalizeArticles(list)
      currentPage.value = 1
      hasMore.value = list.length >= PAGE_SIZE
    } catch (err: any) {
      error.value = err.message || '加载失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    const nextPage = currentPage.value + 1
    try {
      const list = await getRecommendArticles(nextPage, PAGE_SIZE)
      articles.value = [...articles.value, ...normalizeArticles(list)]
      currentPage.value = nextPage
      hasMore.value = list.length >= PAGE_SIZE
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
    currentPage,
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
