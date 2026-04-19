import { ref } from 'vue'
import type { ArticleItem } from '../types/api'

// 收藏的文章列表
const collectedArticles = ref<ArticleItem[]>([])

// 从 localStorage 加载
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('collected-articles')
    if (stored) {
      collectedArticles.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载收藏记录失败:', error)
  }
}

// 保存到 localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('collected-articles', JSON.stringify(collectedArticles.value))
  } catch (error) {
    console.error('保存收藏记录失败:', error)
  }
}

// 添加收藏
export const addCollectedArticle = (article: ArticleItem) => {
  // 检查是否已收藏
  if (!isArticleCollected(article.article_id)) {
    collectedArticles.value.unshift(article)
    saveToStorage()
    return true
  }
  return false
}

// 取消收藏
export const removeCollectedArticle = (articleId: string) => {
  collectedArticles.value = collectedArticles.value.filter(a => a.article_id !== articleId)
  saveToStorage()
}

// 切换收藏状态
export const toggleCollectedArticle = (article: ArticleItem) => {
  if (isArticleCollected(article.article_id)) {
    removeCollectedArticle(article.article_id)
    return false
  } else {
    addCollectedArticle(article)
    return true
  }
}

// 检查是否已收藏
export const isArticleCollected = (articleId: string): boolean => {
  return collectedArticles.value.some(a => a.article_id === articleId)
}

// 获取所有收藏
export const getAllCollectedArticles = () => {
  return collectedArticles.value
}

// 获取收藏数量
export const getCollectedCount = () => {
  return collectedArticles.value.length
}

// 清空收藏
export const clearCollectedArticles = () => {
  collectedArticles.value = []
  saveToStorage()
}

// 初始化时加载
loadFromStorage()

// 导出响应式引用
export const useCollectedArticles = () => {
  return {
    collectedArticles,
    addCollectedArticle,
    removeCollectedArticle,
    toggleCollectedArticle,
    isArticleCollected,
    getAllCollectedArticles,
    getCollectedCount,
    clearCollectedArticles,
  }
}
