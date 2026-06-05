/**
 * 将日期字符串格式化为相对时间
 * 规则：刚刚 → X分钟前 → X小时前 → 昨天 → X天前 → X周前 → X个月前 → X年前 → 具体日期
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
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
