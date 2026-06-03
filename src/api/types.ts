/**
 * API响应类型定义
 * 与后端API响应结构完全对应
 */

// 通用API响应包装
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 文章难度类型
export type Difficulty = '初级' | '中级' | '深度';

// 文章列表项（首页推荐）
export interface ArticleListItem {
  article_id: string;        // 文章ID
  title: string;             // 文章标题
  author: string;            // 作者
  publish_time: string;      // 发布时间（ISO 8601格式）
  category: string;          // 分类
  ai_summary: string;        // AI生成的精华摘要
  tags: string[];            // 技术标签数组
  difficulty: Difficulty;    // 文章难度
  view_count: number;        // 浏览次数
  is_collected: boolean;     // 是否已收藏
}

// 推荐文章列表响应
export interface RecommendArticlesResponse {
  article_list: ArticleListItem[];
}

// 文章详情
export interface ArticleDetail {
  article_id: string;
  title: string;
  author: string;
  publish_time: string;
  category: string;
  ai_summary: string;
  tags: string[];
  content: string;           // Markdown正文
  metrics: {
    view_count: number;      // 浏览次数
    like_count: number;      // 点赞次数
    collect_count: number;   // 收藏次数
  };
  interaction_status: {
    is_liked: boolean;       // 是否已点赞
    is_collected: boolean;   // 是否已收藏
  };
  original_url: string;      // 原文链接
}

// 核心技术栈
export interface CoreInterest {
  name: string;    // 技术名称
  weight: number;  // 权重（0-100）
}

// AI分析结果
export interface AIAnalysis {
  ai_profile_summary: string;    // AI生成的用户专属评语
  technical_level: string;       // 技术等级
  core_interests: CoreInterest[]; // 核心技术栈
}

// 用户侧写
export interface UserProfile {
  user_id: string;
  nickname: string;
  avatar_url: string;
  ai_analysis: AIAnalysis;
}

// ========== 评论相关类型 ==========

// 二级回复
export interface CommentReply {
  comment_id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  reply_to_user_id: string;
  reply_to_username: string;
  content: string;
  like_count: number;
  is_liked: boolean;
  created_at: string;
}

// 一级评论（含二级回复）
export interface Comment {
  comment_id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  content: string;
  like_count: number;
  is_liked: boolean;
  created_at: string;
  replies?: CommentReply[];
}

// 评论列表响应
export interface CommentListResponse {
  total: number;
  page: number;
  size: number;
  comments: Comment[];
}

// 发表评论请求
export interface CreateCommentRequest {
  article_id: string;
  content: string;
  parent_id?: string;        // 默认为 "0"，代表一级评论
  reply_to_user_id?: string; // 回复二级评论时需要
}

// 评论互动请求
export interface CommentActionRequest {
  comment_id: string;
  action_type: 1 | 2; // 1: 点赞, 2: 取消点赞
}

// ========== 互动动作类型 ==========

// 文章互动请求
export interface ArticleActionRequest {
  article_id: string;
  action_type: 1 | 2; // 1: 点赞, 2: 收藏
}
