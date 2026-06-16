/** * 统一接口返回包装 
 */
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/** * 文章简要信息（用于列表流）
 */
export interface ArticleListItem {
  article_id: string;
  title: string;
  author: string;
  publish_time: string;
  category: string;
  ai_summary: string;
  tags: string[];
  difficulty: '初级' | '中级' | '深度';
  view_count: number;
  is_collected: boolean;
}

/** * 用户侧写数据
 */
export interface UserProfile {
  user_id: string;
  username: string;
  avatar_url: string;
  ai_analysis: {
    ai_profile_summary: string;
    technical_level: string;
    core_interests: Array<{ name: string; weight: number }>;
  };
}

/** * 文章详情完整数据
 */
export interface ArticleDetail extends Omit<ArticleListItem, 'view_count'> {
  content: string;
  metrics: {
    view_count: number;
    like_count: number;
    collect_count: number;
  };
  interaction_status: {
    is_liked: boolean;
    is_collected: boolean;
  };
  original_url: string;
}