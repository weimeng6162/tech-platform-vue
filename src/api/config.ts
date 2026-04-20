/**
 * API配置文件
 * 管理API基础配置，支持环境变量
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// API配置
export const apiConfig: ApiConfig = {
  // 从环境变量读取API基础地址，默认为本地开发地址
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // 请求超时时间：10秒
  timeout: 10000,
  // 公共请求头
  headers: {
    'Content-Type': 'application/json'
  }
};

export default apiConfig;
