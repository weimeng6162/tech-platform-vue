/**
 * 文章相关API
 */

import { get, post } from '../request';
import type { 
  ArticleListItem, 
  ArticleDetail, 
  RecommendArticlesResponse,
  CommentListResponse,
  CreateCommentRequest,
  CommentActionRequest,
  ArticleActionRequest
} from '../types';

/**
 * 获取推荐文章列表
 * @returns 推荐文章列表
 */
export function getRecommendArticles(): Promise<ArticleListItem[]> {
  return get<RecommendArticlesResponse>('/api/articles/recommend')
    .then((data) => data.article_list);
}

/**
 * 获取文章详情
 * @param articleId 文章ID
 * @returns 文章详情
 */
export function getArticleDetail(articleId: string): Promise<ArticleDetail> {
  return get<ArticleDetail>('/api/articles/detail', {
    params: { article_id: articleId }
  });
}

/**
 * 获取文章评论列表（分页）
 * @param articleId 文章ID
 * @param page 页码（从1开始）
 * @param size 每页数量
 * @returns 评论列表响应
 */
export function getArticleComments(
  articleId: string,
  page: number = 1,
  size: number = 10
): Promise<CommentListResponse> {
  return get<CommentListResponse>('/api/articles/comments', {
    params: {
      article_id: articleId,
      page,
      size
    }
  });
}

/**
 * 发表评论/二级回复
 * @param data 评论数据
 * @returns 响应结果
 */
export function createComment(data: CreateCommentRequest): Promise<any> {
  return post('/api/comments/create', data);
}

/**
 * 评论交互动作（点赞/取消点赞）
 * @param data 交互数据
 * @returns 响应结果
 */
export function commentAction(data: CommentActionRequest): Promise<any> {
  return post('/api/comments/action', data);
}

/**
 * 文章交互动作（点赞/收藏）
 * @param data 交互数据
 * @returns 响应结果
 */
export function articleAction(data: ArticleActionRequest): Promise<any> {
  return post('/api/user/action', data);
}
