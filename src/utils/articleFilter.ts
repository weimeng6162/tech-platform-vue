import type { ArticleItem } from '../types/api'
import { isBlockedArticle, hasCommercialContent } from '../types/api'

/**
 * 过滤劣质文章
 * @param articles 文章列表
 * @returns 过滤后的文章列表
 */
export function filterBlockedArticles(articles: ArticleItem[]): ArticleItem[] {
  return articles.filter((article) => !isBlockedArticle(article.tags))
}

/**
 * 为文章添加安全标记
 * @param article 文章项
 * @returns 带安全标记的文章
 */
export function addSecurityFlags(article: ArticleItem) {
  return {
    ...article,
    isBlocked: isBlockedArticle(article.tags),
    hasWarning: hasCommercialContent(article.tags),
  }
}

/**
 * 批量处理文章列表
 * @param articles 文章列表
 * @returns 处理后的文章列表（已过滤劣质文章）
 */
export function processArticles(articles: ArticleItem[]): ArticleItem[] {
  // 1. 过滤劣质文章
  const filtered = filterBlockedArticles(articles)

  // 2. 添加安全标记
  return filtered.map(addSecurityFlags)
}

/**
 * 获取文章的安全状态描述
 * @param tags 标签列表
 * @returns 安全状态描述
 */
export function getSecurityStatus(tags: string[]): {
  type: 'safe' | 'warning' | 'blocked'
  message: string
  icon: string
} {
  if (isBlockedArticle(tags)) {
    const blockedTag = tags.find((tag) =>
      ['安全拦截', '提示词注入', '营销软文', '技术水文'].includes(tag)
    )
    return {
      type: 'blocked',
      message: `AI 识别为${blockedTag}，已自动过滤`,
      icon: '🚫',
    }
  }

  if (hasCommercialContent(tags)) {
    return {
      type: 'warning',
      message: 'AI 检测到文末包含商业推广内容',
      icon: '⚠️',
    }
  }

  return {
    type: 'safe',
    message: '内容安全',
    icon: '✅',
  }
}
