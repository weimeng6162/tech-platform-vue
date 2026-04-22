// src/types.ts

/** 文章难度等级，只允许这三个字符串 */
export type DifficultyLevel = '初级' | '中级' | '深度';

/** 定义文章列表项的数据结构 */
export interface ArticleListItem {
  id: number;
  title: string;
  summary: string;
  ai_summary: string;    // AI 摘要
  tags: string[];        // 标签数组，如 ["Vue3", "商业推广"]
  difficulty: DifficultyLevel;
  publish_time: string;
  cover_url: string;     // 封面图地址
}