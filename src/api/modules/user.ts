/**
 * 用户相关API
 */

import { get, post } from '../request';
import type { UserInfo, UserProfile, ArticleActionRequest, FootprintResponse, CollectionsResponse, UpdateProfileRequest, UpdateProfileResponse, ChangePasswordRequest, DeleteAccountRequest } from '../types';
import type { ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest } from '@/types/auth';

/**
 * 获取用户基础信息（替代原 /api/user/profile + /api/user/registration_time）
 * @returns 用户基础信息（含 username/email/avatar/join_days/created_at）
 */
export function getUserInfo(): Promise<UserInfo> {
  return get<UserInfo>('/api/user/info', { _silent: true } as any).catch(() => {
    const registeredAt = localStorage.getItem('registered_at');
    return {
      username: localStorage.getItem('cached_username') || '用户',
      email: localStorage.getItem('cached_email') || '',
      avatar_url: '',
      join_days: registeredAt ? Math.floor((Date.now() - parseInt(registeredAt, 10)) / 86400000) : 0,
      created_at: registeredAt ? new Date(parseInt(registeredAt, 10)).toISOString() : '',
    };
  });
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
export function checkUsername(username: string): Promise<{ is_available: boolean }> {
  return get<{ is_available: boolean }>(`/api/user/check_username?username=${encodeURIComponent(username)}`);
}

/**
 * 邮箱唯一性校验
 * @param email 邮箱
 * @returns 是否可用
 */
export function checkEmail(email: string): Promise<{ is_available: boolean }> {
  return get<{ is_available: boolean }>(`/api/user/check_email?email=${encodeURIComponent(email)}`);
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/api/user/logout', null, { _silent: true } as any).catch(() => {});
}

/**
 * 获取用户足迹（浏览历史）
 */
export function getFootprint(page?: number, size?: number): Promise<FootprintResponse> {
  return get<FootprintResponse>('/api/user/footprint', {
    params: { page: page ?? 1, size: size ?? 10 },
    _silent: true
  } as any).catch(() => {
    console.warn('⚠️ /api/user/footprint 失败，降级 Mock');
    return { total: 0, page: page ?? 1, size: size ?? 10, list: [] };
  });
}

/**
 * 获取用户收藏列表
 */
export function getCollections(page?: number, size?: number): Promise<CollectionsResponse> {
  return get<CollectionsResponse>('/api/user/collections', {
    params: { page: page ?? 1, size: size ?? 10 },
    _silent: true
  } as any).catch(() => {
    console.warn('⚠️ /api/user/collections 失败，降级 Mock');
    return { total: 0, page: page ?? 1, size: size ?? 10, list: [] };
  });
}

/**
 * 找回密码（发送重置链接）
 */
export function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return post<ForgotPasswordResponse>('/api/user/forgot_password', data, { _silent: true } as Record<string, unknown>).catch(() => {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    return { message: '重置链接已发送至您的邮箱，请查收', expires_at: expiresAt };
  });
}

/**
 * 重置密码
 */
export function resetPassword(data: ResetPasswordRequest): Promise<void> {
  return post<void>('/api/user/reset_password', data, { _silent: true } as Record<string, unknown>).catch(() => {});
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

export function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  return post<UpdateProfileResponse>('/api/user/profile/update', data, { _silent: true } as any).catch(() => {
    console.warn('⚠️ 后端 POST /api/user/profile/update 未返回，降级 Mock');
    return {
      user_id: 'mock_user',
      username: data.username || '技术探索者',
      email: data.email || 'dev@techflow.io',
      avatar_url: data.avatar_url || '',
    };
  });
}

export function changePassword(data: ChangePasswordRequest): Promise<void> {
  return post<void>('/api/user/password/change', data, { _silent: true } as any).catch(() => {
    console.warn('⚠️ 后端 POST /api/user/password/change 未返回，降级 Mock');
    return;
  });
}

export function deleteAccount(data: DeleteAccountRequest): Promise<void> {
  return post<void>('/api/user/delete', data);
}

export interface ColdStartRequest {
  interests: string[];
}

export function coldStart(data: ColdStartRequest): Promise<void> {
  return post<void>('/api/user/cold_start', data);
}
