/**
 * 用户相关API
 */

import { get } from '../request';
import type { UserProfile } from '../types';

/**
 * 获取用户侧写信息
 * @returns 用户侧写
 */
export function getUserProfile(): Promise<UserProfile> {
  return get<UserProfile>('/api/user/profile');
}
