/**
 * 安全解析日期字符串或时间戳，返回 Date 对象
 * 支持 ISO 字符串、Unix 时间戳（秒或毫秒）
 */
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date(0)
  const n = Number(dateStr)
  if (!isNaN(n)) {
    // Unix 秒级时间戳（< 1e10 → 2001年以前）→ 转毫秒
    // Unix 毫秒级时间戳（≥ 1e10）→ 直接使用
    return new Date(n < 1e10 ? n * 1000 : n)
  }
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? new Date() : d
}

/**
 * 将日期字符串格式化为相对时间
 * 规则：刚刚 → X分钟前 → X小时前 → 昨天 → X天前 → X周前 → X个月前 → X年前 → 具体日期
 */
export function formatRelativeTime(dateStr: string): string {
  const date = parseDate(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (weeks < 5) return `${weeks}周前`
  if (months < 12) return `${months}个月前`
  if (years >= 1) return `${years}年前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 格式化为中文完整日期（如 "2026年7月18日"）
 */
export function formatDate(dateStr: string): string {
  const date = parseDate(dateStr)
  if (!date || isNaN(date.getTime())) return ''
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
