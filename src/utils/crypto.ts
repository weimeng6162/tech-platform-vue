/**
 * 密码加密工具
 * 使用 SHA-256 加密算法保护用户密码
 */

/**
 * 使用 SHA-256 加密密码
 * @param password 原始密码
 * @returns 加密后的十六进制字符串
 */
export async function encryptPassword(password: string): Promise<string> {
  // 将密码转换为 Uint8Array
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  
  // 使用 SubtleCrypto API 进行 SHA-256 加密
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  
  // 将 ArrayBuffer 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * 添加时间戳和随机盐值增强安全性
 * @param password 原始密码
 * @returns 增强后的密码
 */
export function enhancePassword(password: string): string {
  const timestamp = Date.now()
  const randomSalt = Math.random().toString(36).substring(2, 15)
  return `${password}:${timestamp}:${randomSalt}`
}
