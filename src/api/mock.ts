/**
 * Mock 数据 — 后端接口未就绪时的临时数据
 */

import type { UserProfile, UserProfileResponse } from './types'

export const MOCK_USER_PROFILE: UserProfile = {
  user_id: 'mock_user_001',
  username: '技术探索者',
  email: 'dev@techflow.io',
  avatar_url: '',
  created_at: '2026-03-15T08:30:00Z',
  ai_analysis: {
    technical_level: '高级工程师',
    ai_profile_summary:
      '全栈偏前端，对 Vue 生态有深入理解。近期关注 AI 工程化和性能优化方向。',
    core_interests: [
      { name: '前端架构', weight: 92 },
      { name: 'TypeScript', weight: 88 },
      { name: 'AI 工程化', weight: 75 },
      { name: '性能优化', weight: 70 },
      { name: '系统设计', weight: 65 },
    ],
  },
}

export const MOCK_USER_PROFILE_RESPONSE: UserProfileResponse = {
  ...MOCK_USER_PROFILE,
  is_configured: true,
  technical_level: '高级工程师',
}

/** 模拟异步延迟 */
export function mockDelay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** 模拟成功响应 */
export async function mockSuccess<T>(data: T, delay = 300): Promise<T> {
  await mockDelay(delay)
  return data
}

/** 模拟失败响应 */
export async function mockFail(message: string, delay = 300): Promise<never> {
  await mockDelay(delay)
  throw new Error(message)
}
