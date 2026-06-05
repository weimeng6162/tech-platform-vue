/**
 * 用户相关API
 */

import { get, post } from '../request';
import type { UserProfile } from '../types';

/**
 * 获取用户侧写信息
 * @returns 用户侧写
 */
export function getUserProfile(): Promise<UserProfile> {
  return get<UserProfile>('/api/user/profile');
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  username: string;     // 用户名（后端要求）
  password: string;     // 加密后的密码
  timestamp?: number;   // 时间戳（可选）
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string;        // JWT token
  user: UserProfile;    // 用户信息
}

/**
 * 用户登录
 * @param data 登录参数
 * @returns 登录响应
 */
export function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>('/api/user/login', data);
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
  username: string;    // 用户名
  email: string;       // 邮箱
  password: string;    // 加密后的密码
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  token?: string;      // JWT token（真实后端返回）
  user_id?: string;    // 用户ID（Mock返回）
  message?: string;    // 提示信息（Mock返回）
}

/**
 * 用户注册
 * @param data 注册参数
 * @returns 注册响应
 */
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>('/api/user/register', data);
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/api/user/logout');
}

/**
 * 找回密码请求参数
 */
export interface ForgotPasswordRequest {
  email: string;       // 注册邮箱
}

/**
 * 找回密码响应数据
 */
export interface ForgotPasswordResponse {
  message: string;     // 提示信息
  expires_at: string;  // 重置链接过期时间
}

/**
 * 找回密码（发送重置链接）
 * @param data 找回密码参数
 * @returns 找回密码响应
 */
export function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return post<ForgotPasswordResponse>('/api/user/forgot-password', data);
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  token: string;       // 重置令牌
  password: string;    // 新密码（加密后）
}

/**
 * 重置密码
 * @param data 重置密码参数
 */
export function resetPassword(data: ResetPasswordRequest): Promise<void> {
  return post<void>('/api/user/reset-password', data);
}
