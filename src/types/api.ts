/**
 * API 响应类型定义
 */

// 基础响应结构
export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 文章推荐列表响应
export interface RecommendArticlesData {
  article_list: ArticleItem[]
}

export interface ArticleItem {
  article_id: string
  title: string
  author: string
  publish_time: string
  category: string
  ai_summary: string // AI 生成的精华摘要
  tags: string[]
  difficulty: '初级' | '中级' | '深度'
  view_count: number
  is_collected: boolean
}

// 用户画像响应
export interface UserProfileData {
  user_id: string
  nickname: string
  avatar_url: string
  ai_analysis: AIAnalysis
}

export interface AIAnalysis {
  ai_profile_summary: string // AI 生成的专属评语
  technical_level: string
  core_interests: CoreInterest[]
}

export interface CoreInterest {
  name: string
  weight: number // 0-100 的权重值
}

// 难度颜色映射
export const difficultyColors = {
  初级: '#52c41a',
  中级: '#1890ff',
  深度: '#722ed1',
} as const

// 难度图标映射
export const difficultyIcons = {
  初级: '🌱',
  中级: '⚡',
  深度: '🚀',
} as const

// 文章详情响应
export interface ArticleDetailData {
  article_id: string
  title: string
  author: string
  publish_time: string
  category: string
  ai_summary: string
  tags: string[]
  content: string // Markdown 格式的长文本
  metrics: ArticleMetrics
  interaction_status: InteractionStatus
  original_url: string // 原文链接
}

export interface ArticleMetrics {
  view_count: number
  like_count: number
  collect_count: number
}

export interface InteractionStatus {
  is_liked: boolean
  is_collected: boolean
}

// AI 内容安全标签类型
export type SecurityTag = '安全拦截' | '提示词注入' | '营销软文' | '技术水文' | '含商业推广'

// 劣质文章标签（需要过滤）
export const BLOCKED_TAGS: SecurityTag[] = ['安全拦截', '提示词注入', '营销软文', '技术水文']

// 警示标签（需要显示警告）
export const WARNING_TAG: SecurityTag = '含商业推广'

// 检查是否为劣质文章
export function isBlockedArticle(tags: string[]): boolean {
  return tags.some((tag) => BLOCKED_TAGS.includes(tag as SecurityTag))
}

// 检查是否包含商业推广
export function hasCommercialContent(tags: string[]): boolean {
  return tags.includes(WARNING_TAG)
}
