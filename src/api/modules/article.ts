/**
 * 文章相关API
 */

import { get } from '../request';
import type { ArticleItem, ArticleDetailData, RecommendArticlesData } from '../../types/api';

/**
 * 获取推荐文章列表
 * @returns 推荐文章列表
 */
export function getRecommendArticles(): Promise<ArticleItem[]> {
  return get<RecommendArticlesData>('/api/articles/recommend')
    .then((data) => data.article_list);
}

/**
 * 获取文章详情
 * @param articleId 文章ID
 * @returns 文章详情
 */
export function getArticleDetail(articleId: string): Promise<ArticleDetailData> {
  return get<ArticleDetailData>('/api/articles/detail', {
    params: { article_id: articleId }
  });
}
