/**
 * 用户相关API
 */

import { get, post } from '../request';
import type { UserProfile, ArticleActionRequest, FootprintResponse, CollectionsResponse } from '../types';

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
 * 用户名唯一性校验
 * @param username 用户名
 * @returns 是否存在
 */
export function checkUsername(username: string): Promise<{ exists: boolean; message?: string }> {
  return get<{ exists: boolean; message?: string }>(`/api/user/check-username?username=${encodeURIComponent(username)}`);
}

/**
 * 邮箱唯一性校验
 * @param email 邮箱
 * @returns 是否存在
 */
export function checkEmail(email: string): Promise<{ exists: boolean; message?: string }> {
  return get<{ exists: boolean; message?: string }>(`/api/user/check-email?email=${encodeURIComponent(email)}`);
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/api/user/logout');
}

/**
 * 获取用户足迹（浏览历史）
 */
export function getFootprint(page?: number, size?: number): Promise<FootprintResponse> {
  return get<FootprintResponse>(
    `/api/user/footprint?page=${page ?? 1}&size=${size ?? 10}`
  );
}

/**
 * 获取用户收藏列表
 */
export function getCollections(page?: number, size?: number): Promise<CollectionsResponse> {
  return get<CollectionsResponse>(
    `/api/user/collections?page=${page ?? 1}&size=${size ?? 10}`
  );
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

/**
 * 文章互动动作（点赞/收藏）
 * @param data 互动数据
 * @returns 互动结果
 */
export function articleAction(data: ArticleActionRequest): Promise<{
  article_id: string;
  action_type: number;
  success: boolean;
}> {
  return post('/api/user/action', data);
}
