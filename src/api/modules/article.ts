/**
 * 文章相关API
 */

import { get } from '../request';
import type { ArticleListItem, ArticleDetail, RecommendArticlesResponse } from '../types';

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
