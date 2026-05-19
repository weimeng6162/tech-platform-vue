/**
 * Axios实例封装
 * 统一处理请求拦截、响应拦截、错误处理
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { apiConfig, USE_REAL_BACKEND_FOR_AUTH, REAL_BACKEND_URL, MOCK_SERVER_URL, AUTH_ENDPOINTS } from './config';
import type { ApiResponse } from './types';
import router from '../router';

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
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => url.includes(endpoint));
    
    if (USE_REAL_BACKEND_FOR_AUTH && isAuthEndpoint) {
      // 登录/注册接口使用真实后端
      config.baseURL = REAL_BACKEND_URL;
      console.log(`[API路由] 使用真实后端: ${REAL_BACKEND_URL}${url}`);
    } else {
      // 其他接口使用Mock服务器
      config.baseURL = MOCK_SERVER_URL;
      console.log(`[API路由] 使用Mock服务器: ${MOCK_SERVER_URL}${url}`);
    }

    // 从localStorage读取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // 兼容真实后端直接返回数据的格式（如 {token: "Bearer xxx"}）
    if (data.token || data.user_id || data.error) {
      // 真实后端格式
      if (data.error) {
        handleError(400, data.error);
        return Promise.reject(new Error(data.error));
      }
      return data;
    }

    // Mock服务器格式 {code: 200, data: {...}}
    if (data.code === 200) {
      return data.data;
    } else {
      handleError(data.code, data.msg);
      return Promise.reject(new Error(data.msg));
    }
  },
  (error) => {
    // 网络错误、超时等
    if (error.response) {
      // 服务器返回了响应，但状态码不是2xx
      const status = error.response.status;
      const message = error.response.data?.msg || error.message;
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
