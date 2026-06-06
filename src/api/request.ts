/**
 * Axios实例封装
 * 统一处理请求拦截、响应拦截、错误处理
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { apiConfig, USE_REAL_BACKEND_FOR_AUTH, REAL_BACKEND_URL, MOCK_SERVER_URL, AUTH_ENDPOINTS } from './config';
import router from '../router';

// 缓存用户注册时间（毫秒时间戳），0 表示未知/新用户
let cachedRegisteredAt = 0;
try {
  const stored = localStorage.getItem('registered_at');
  if (stored) cachedRegisteredAt = parseInt(stored, 10);
} catch { /* ignore */ }

/** 判断当前用户是否为"新用户"（注册未超过配置天数） */
export function isNewUser(): boolean {
  if (cachedRegisteredAt === 0) return true; // 未知视为新用户
  const daysSince = (Date.now() - cachedRegisteredAt) / 86400000;
  return daysSince < NEW_USER_GRACE_DAYS;
}

/** 更新缓存的注册时间（供 getRegistrationTime 调用后使用） */
export function setRegisteredAt(isoString: string) {
  cachedRegisteredAt = new Date(isoString).getTime();
  localStorage.setItem('registered_at', String(cachedRegisteredAt));
}

// 创建Axios实例
const request: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 智能路由：判断是否使用真实后端
    const url = config.url || '';
    if (USE_REAL_BACKEND_FOR_AUTH) {
      // 所有接口统一使用真实后端
      config.baseURL = REAL_BACKEND_URL;
      console.log(`[API路由] 真实后端: ${REAL_BACKEND_URL}${url}`);
    } else {
      // 使用Mock服务器
      config.baseURL = MOCK_SERVER_URL;
      console.log(`[API路由] Mock服务器: ${MOCK_SERVER_URL}${url}`);
    }

    // 决定是否发送 token
    const isPrivate = PRIVATE_ENDPOINTS.some(ep => url.includes(ep));
    const shouldSendToken = isPrivate || !isNewUser();
    if (shouldSendToken) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
    }

    // 记录请求日志
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${url}`, config.params || config.data);

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;

    console.log(`[API Response] ${response.config.url}`, data);

    // 有 error 字段 → 统一视为错误
    if (data.error) {
      handleError(400, data.error);
      return Promise.reject(new Error(data.error));
    }

    // Mock 格式 { code: 200, data: {...} }，code 为数字才走这条
    if (typeof data.code === 'number') {
      if (data.code === 200) {
        return data.data;
      }
      handleError(data.code, data.msg);
      return Promise.reject(new Error(data.msg));
    }

    // 其他格式（真实后端简单返回如 {exists: false}），直接透传
    return data;
  },
  (error) => {
    // 网络错误、超时等
    if (error.response) {
      // 服务器返回了响应，但状态码不是2xx
      const status = error.response.status;
      const message = error.response.data?.msg || error.message;
      console.error('[API Error Detail] 状态码:', status);
      console.error('[API Error Detail] 响应体:', JSON.stringify(error.response.data, null, 2));
      console.error('[API Error Detail] 请求URL:', error.config?.url);
      console.error('[API Error Detail] 请求方法:', error.config?.method?.toUpperCase());
      handleError(status, message);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      if (error.code === 'ECONNABORTED') {
        handleError(408, '请求超时，请稍后重试');
      } else {
        handleError(0, '网络连接失败，请检查网络设置');
      }
    } else {
      // 请求配置出错
      handleError(0, '请求配置错误');
    }

    return Promise.reject(error);
  }
);

// 错误处理函数
function handleError(code: number, message: string) {
  console.error(`[API Error] Code: ${code}, Message: ${message}`);

  switch (code) {
    case 401:
      // 认证失败：清除token，跳转登录页
      localStorage.removeItem('token');
      router.push('/login');
      showMessage('登录已过期，请重新登录');
      break;
    case 403:
      showMessage('没有权限访问该资源');
      break;
    case 404:
      showMessage('请求的资源不存在');
      break;
    case 408:
      showMessage('请求超时，请稍后重试');
      break;
    case 500:
      showMessage('服务器内部错误');
      break;
    case 0:
      showMessage(message);
      break;
    default:
      showMessage(message || '系统异常，请稍后重试');
  }
}

// 显示错误消息（可替换为UI组件库的Message）
function showMessage(message: string) {
  // 简单实现：使用alert
  // 后续可替换为Naive UI的useMessage
  alert(message);
}

// 封装GET请求
export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, config);
}

// 封装POST请求
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config);
}

export default request;
