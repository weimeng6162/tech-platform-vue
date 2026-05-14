import { ref, computed } from 'vue'
import type { ArticleItem } from '../types/api'

// 浏览历史 - 按照浏览顺序排序
const browsingHistory = ref<ArticleItem[]>([])

// 最大保存数量
const MAX_HISTORY = 20

// 从 localStorage 加载
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('browsing-history')
    if (stored) {
      browsingHistory.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载浏览历史失败:', error)
  }
}

// 保存到 localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('browsing-history', JSON.stringify(browsingHistory.value))
  } catch (error) {
    console.error('保存浏览历史失败:', error)
  }
}

// 添加文章到浏览历史
export const addToBrowsingHistory = (article: ArticleItem) => {
  // 移除已存在的相同文章
  browsingHistory.value = browsingHistory.value.filter(a => a.article_id !== article.article_id)

  // 添加到最前面（最新的在前面）
  browsingHistory.value.unshift(article)

  // 限制数量
  if (browsingHistory.value.length > MAX_HISTORY) {
    browsingHistory.value = browsingHistory.value.slice(0, MAX_HISTORY)
  }

  // 保存到 localStorage
  saveToStorage()
}

// 获取浏览历史
export const getBrowsingHistory = () => {
  return browsingHistory.value
}

// 清空浏览历史
export const clearBrowsingHistory = () => {
  browsingHistory.value = []
  saveToStorage()
}

// 获取文章在历史中的序号（用于显示"文章1"、"文章2"等）
export const getArticleIndex = (articleId: string) => {
  const index = browsingHistory.value.findIndex(a => a.article_id === articleId)
  return index !== -1 ? index + 1 : null
}

// 初始化时加载
loadFromStorage()

// 导出响应式引用
export const useBrowsingHistory = () => {
  return {
    browsingHistory: computed(() => browsingHistory.value),
    addToBrowsingHistory,
    getBrowsingHistory,
    clearBrowsingHistory,
    getArticleIndex,
  }
}