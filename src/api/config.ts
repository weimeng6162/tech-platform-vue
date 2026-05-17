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

// 真实后端地址（用于登录/注册）
export const REAL_BACKEND_URL = 'http://8.156.93.58:8080';

// Mock服务器地址（用于其他功能）
export const MOCK_SERVER_URL = 'http://localhost:3000';

// 需要路由判定的接口列表
export const AUTH_ENDPOINTS = [
  '/api/user/login',
  '/api/user/register',
  '/api/user/logout',
  '/api/user/forgot-password',
  '/api/user/reset-password'
];

// ========== 配置开关结束 ==========

// API配置
export const apiConfig: ApiConfig = {
  // 默认使用mock服务器
  baseURL: MOCK_SERVER_URL,
  // 请求超时时间：10秒
  timeout: 10000,
  // 公共请求头
  headers: {
    'Content-Type': 'application/json'
  }
};

export default apiConfig;
