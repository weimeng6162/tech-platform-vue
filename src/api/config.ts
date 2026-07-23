/**
 * API配置文件
 * 管理API基础配置，支持环境变量
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// ========== 配置开关 ==========

/**
 * 登录/注册接口模式
 * true: 使用真实后端
 * false: 使用Mock服务器
 * 
 * 联调时设为 true，独立开发时设为 false
 */
export const USE_REAL_BACKEND_FOR_AUTH = true;

// 真实后端地址（用于登录/注册），优先读取环境变量 VITE_API_BASE_URL
export const REAL_BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://8.156.93.58:8080';

// Mock服务器地址（用于其他功能）
export const MOCK_SERVER_URL = import.meta.env.VITE_MOCK_SERVER_URL || 'http://localhost:3000';

// 需要路由判定的接口列表
export const AUTH_ENDPOINTS = [
  '/api/user/login',
  '/api/user/register',
  '/api/user/logout',
  '/api/user/check_username',
  '/api/user/check_email',
  '/api/user/info',
  '/api/user/footprint',
  '/api/user/collections'
];

// 需要登录认证的接口（必须带 token）
export const PRIVATE_ENDPOINTS = [
  '/api/user/info',
  '/api/user/profile',
  '/api/user/footprint',
  '/api/user/collections',
  '/api/user/action',
  '/api/user/logout',
  '/api/user/password/change',
  '/api/user/profile/update',
  '/api/user/delete',
  '/api/user/cold_start',
  '/api/articles/recommend',
  '/api/articles/comments',
  '/api/comments/create',
  '/api/comments/action'
];

// 新用户免 token 天数（注册后 N 天内不传 token）
export const NEW_USER_GRACE_DAYS = 1;

// ========== 配置开关结束 ==========

// API配置
export const apiConfig: ApiConfig = {
  // 默认使用mock服务器
  baseURL:'',
  // 请求超时时间：10秒
  timeout: 10000,
  // 公共请求头
  headers: {
    'Content-Type': 'application/json'
  }
};

export default apiConfig;
