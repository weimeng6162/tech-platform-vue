import { ref, watch } from 'vue'
import type { ArticleItem } from '../types/api'

// 最近阅读的文章列表
const recentArticles = ref<ArticleItem[]>([])

// 最大保存数量
const MAX_RECENT = 10

// 从 localStorage 加载
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('recent-articles')
    if (stored) {
      recentArticles.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载最近阅读记录失败:', error)
  }
}

// 保存到 localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('recent-articles', JSON.stringify(recentArticles.value))
  } catch (error) {
    console.error('保存最近阅读记录失败:', error)
  }
}

// 添加文章到最近阅读
export const addRecentArticle = (article: ArticleItem) => {
  // 移除已存在的相同文章
  recentArticles.value = recentArticles.value.filter(a => a.article_id !== article.article_id)
  
  // 添加到最前面
  recentArticles.value.unshift(article)
  
  // 限制数量
  if (recentArticles.value.length > MAX_RECENT) {
    recentArticles.value = recentArticles.value.slice(0, MAX_RECENT)
  }
  
  // 保存到 localStorage
  saveToStorage()
}

// 获取最近阅读的文章
export const getRecentArticle = (): ArticleItem | null => {
  return recentArticles.value[0] || null
}

// 获取所有最近阅读
export const getAllRecentArticles = () => {
  return recentArticles.value
}

// 清空最近阅读
export const clearRecentArticles = () => {
  recentArticles.value = []
  saveToStorage()
}

// 初始化时加载
loadFromStorage()

// 导出响应式引用
export const useRecentArticles = () => {
  return {
    recentArticles,
    addRecentArticle,
    getRecentArticle,
    getAllRecentArticles,
    clearRecentArticles,
  }
}
