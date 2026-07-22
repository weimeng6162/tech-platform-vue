<template>
  <div class="profile-page">
    <!-- 顶部氛围光晕 -->
    <div class="atmosphere-glow" />

    <!-- 页面标识 -->
    <div class="page-header">
      <span class="page-label">个人主页</span>
    </div>

    <!-- 骨架屏 -->
    <template v-if="loading">
      <div class="profile-card skeleton-card">
        <div class="skeleton-avatar" />
        <div class="skeleton-line skeleton-name" />
        <div class="skeleton-line skeleton-level" />
        <div class="skeleton-line skeleton-email" />
        <div class="skeleton-stats">
          <div class="skeleton-stat" v-for="i in 4" :key="i" />
        </div>
      </div>
    </template>

    <!-- 主体内容 -->
    <template v-else-if="profile">
      <!-- 头像 + 基本信息 -->
      <div class="hero-section">
        <div class="avatar-wrapper">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            :alt="profile.username"
            class="avatar-img"
          />
          <span v-else class="avatar-placeholder">{{ profile.username?.[0] ?? '?' }}</span>
        </div>
        <h1 class="nickname">{{ profile.username }}</h1>
        <p class="technical-level">{{ technicalLevel }}</p>
        <div class="meta-row">
          <span class="meta-item">
            <Mail :size="14" />
            {{ profile.email || '未绑定邮箱' }}
          </span>
          <span class="meta-divider">·</span>
          <span class="meta-item">
            <Calendar :size="14" />
            加入 {{ joinDays }} 天
          </span>
        </div>
      </div>

      <!-- 统计条 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">{{ coreInterests.length }}</span>
          <span class="stat-label">兴趣领域</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num">{{ technicalLevel }}</span>
          <span class="stat-label">技术评级</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num">{{ potentialTags.length }}</span>
          <span class="stat-label">核心标签</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <span class="stat-num">{{ profile.is_configured ? '已配置' : '未配置' }}</span>
          <span class="stat-label">兴趣偏好</span>
        </div>
      </div>

      <!-- 兴趣标签云 -->
      <div class="profile-card">
        <div class="card-header">
          <Tag :size="16" />
          <h3>兴趣配置</h3>
        </div>
        <div class="tag-cloud-wrapper">
          <div class="tag-cloud" ref="tagCloudRef">
            <span
              v-for="item in coreInterests"
              :key="item.name"
              class="tag-chip"
              :style="tagStyle(item.weight)"
              :title="`${item.name} · 权重 ${item.weight}`"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 雷达图 + AI 分析 -->
      <div class="profile-card radar-analysis-card">
        <div class="card-header">
          <Sparkles :size="16" />
          <h3>AI 技术画像</h3>
        </div>
        <div class="radar-analysis-body">
          <div class="radar-section">
            <RadarChart :data="radarDimensions" />
          </div>
          <div class="analysis-section">
            <blockquote class="ai-summary">
              <Sparkles :size="14" class="summary-icon" />
              <p>{{ profile.ai_analysis?.ai_profile_summary || '暂无分析' }}</p>
            </blockquote>
            <div v-if="potentialTags.length" class="potential-area">
              <span class="potential-label">潜能方向</span>
              <div class="potential-tags">
                <span
                  v-for="tag in potentialTags"
                  :key="tag"
                  class="potential-tag"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 足迹 & 收藏 -->
      <div class="profile-card">
        <div class="card-header">
          <Layers :size="16" />
          <h3>内容资产</h3>
        </div>
        <AssetTabs link-from="userProfile" />
      </div>
    </template>

    <!-- 请求失败占位 -->
    <template v-else>
      <div class="profile-card placeholder-card">
        <div class="hero-section">
          <div class="avatar-wrapper">
            <span class="avatar-placeholder">?</span>
          </div>
          <h1 class="nickname placeholder-text">未登录用户</h1>
          <p class="technical-level placeholder-text">暂无数据</p>
        </div>
        <div class="empty-state">
          <UserX :size="28" />
          <span>请登录后查看个人主页</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserX, Sparkles, Layers, Tag, Mail, Calendar } from 'lucide-vue-next'
import RadarChart from '../components/RadarChart.vue'
import AssetTabs from '../components/AssetTabs.vue'
import { getUserInfo } from '../api/modules/user'
import { MOCK_USER_PROFILE_RESPONSE } from '../api/mock'
import type { UserProfileResponse, CoreInterest } from '../api/types'

const profile = ref<UserProfileResponse | null>(null)
const loading = ref(true)
const tagCloudRef = ref<HTMLElement>()

const coreInterests = computed<CoreInterest[]>(() =>
  profile.value?.ai_analysis?.core_interests ?? []
)

const technicalLevel = computed(() =>
  profile.value?.ai_analysis?.technical_level ?? profile.value?.technical_level ?? '技术探索者'
)

const joinDays = computed(() => {
  const info = profile.value
  if (info && 'created_at' in info) {
    const created = new Date((info as any).created_at)
    if (!isNaN(created.getTime())) {
      return Math.floor((Date.now() - created.getTime()) / 86400000)
    }
  }
  return '--'
})

const potentialTags = computed(() => {
  const interests = coreInterests.value
  return interests
    .filter(i => i.weight >= 60)
    .map(i => i.name)
})

// 雷达图 6 维度聚合
const DIMENSION_KEYWORDS: [string, RegExp][] = [
  ['前端技术', /前端|frontend|vue|react|angular|svelte|html|css|tailwind|typescript|javascript|webpack|vite/i],
  ['后端架构', /后端|backend|java|go\b|python|rust|spring|django|flask|express|fastapi|node\.?js|php|ruby|服务端|api/i],
  ['AI 与数据', /ai|机器学习|深度|nlp|llm|大模型|aigc|tensorflow|pytorch|数据|ml\b|neural|智能/i],
  ['系统与底层', /系统|底层|os\b|linux|算法|数据结构|网络|c\b|c\+\+|compiler|kernel|汇编/i],
  ['安全', /安全|渗透|漏洞|vuln|pentest|security|hack|crypt/i],
  ['云与 DevOps', /运维|devops|docker|kuber|k8s|云\b|cloud|容器|ci\b|cd\b|git|database|sql|mysql|redis|mongo|elastic/i],
]

const radarDimensions = computed(() => {
  const interests = coreInterests.value
  if (!interests.length) return []

  const dims = new Map<string, number>()
  for (const dim of DIMENSION_KEYWORDS) {
    dims.set(dim[0], 0)
  }

  for (const item of interests) {
    for (const [dim, regex] of DIMENSION_KEYWORDS) {
      if (regex.test(item.name)) {
        dims.set(dim, Math.max(dims.get(dim)!, item.weight))
        break
      }
    }
  }

  return [...dims.entries()]
    .map(([name, weight]) => ({ name, weight: weight || 5 }))
})

function tagStyle(weight: number) {
  const alpha = 0.45 + (weight / 100) * 0.55
  const scale = 0.85 + (weight / 100) * 0.15
  return {
    '--tag-alpha': alpha,
    '--tag-scale': scale,
    fontSize: `${0.78 + (weight / 100) * 0.22}rem`,
    fontWeight: weight >= 80 ? 600 : 400,
  }
}

async function fetchProfile() {
  loading.value = true
  try {
    const info = await getUserInfo()
    profile.value = {
      user_id: '',
      username: info.username,
      avatar_url: info.avatar_url,
      is_configured: true,
      technical_level: '',
      ai_analysis: MOCK_USER_PROFILE_RESPONSE.ai_analysis,
      ...('email' in info ? { email: (info as any).email } : {}),
      ...('created_at' in info ? { created_at: (info as any).created_at } : {}),
    } as UserProfileResponse
  } catch {
    console.warn('⚠️ /api/user/info 失败，降级 Mock')
    profile.value = MOCK_USER_PROFILE_RESPONSE
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile-page {
  position: relative;
  width: 80%;
  max-width: 1200px;
  margin: calc(-1 * var(--space-lg)) auto 0;
  padding: 0 var(--space-lg) var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .profile-page {
    width: 100%;
    padding: 0 var(--space-md) var(--space-xl);
  }
}

/* ===== 氛围光晕 ===== */
.atmosphere-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 320px;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    ellipse 80% 50% at 50% 0%,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(139, 92, 246, 0.06) 45%,
    transparent 70%
  );
}

:global([data-theme="light"]) .atmosphere-glow {
  background: radial-gradient(
    ellipse 80% 50% at 50% 0%,
    rgba(88, 28, 135, 0.10) 0%,
    rgba(107, 33, 168, 0.04) 45%,
    transparent 70%
  );
}

/* ===== 头像区域 ===== */
.hero-section {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-sm) 0 var(--space-sm);
  gap: 2px;
}

.page-header {
  position: relative;
  z-index: 1;
  padding-top: var(--space-sm);
}

.page-label {
  font-size: 0.72rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.45;
  user-select: none;
}

.avatar-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  margin-bottom: 6px;
}

.avatar-wrapper::after {
  content: '';
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

:global([data-theme="light"]) .avatar-wrapper::after {
  background: radial-gradient(circle, rgba(107, 33, 168, 0.15) 0%, transparent 70%);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 3px var(--bg-primary), 0 0 20px rgba(99, 102, 241, 0.25);
}

:global([data-theme="light"]) .avatar-img {
  box-shadow: 0 0 0 3px var(--bg-primary), 0 0 16px rgba(107, 33, 168, 0.2);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 0 0 3px var(--bg-primary), 0 0 20px rgba(99, 102, 241, 0.25);
}

.nickname {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.technical-level {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.08);
  display: inline-block;
  padding: 2px 12px;
  border-radius: var(--radius-full);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: 2px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.meta-item :deep(svg) {
  opacity: 0.5;
}

.meta-divider {
  color: var(--border-secondary);
  font-size: 0.8rem;
}

/* ===== 统计条 ===== */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-sm) 0;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.68rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border-primary);
}

@media (max-width: 640px) {
  .stats-bar {
    gap: var(--space-md);
    flex-wrap: wrap;
  }
  .stat-divider {
    height: 24px;
  }
}

/* ===== 卡片容器 ===== */
.profile-card {
  position: relative;
  z-index: 1;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-primary);
}

.card-header h3 {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-header :deep(svg) {
  color: var(--accent-primary);
}

/* ===== 兴趣标签云 ===== */
.tag-cloud-wrapper {
  max-height: 108px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-primary) transparent;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
}

.tag-chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(99, 102, 241, calc(var(--tag-alpha, 0.6)));
  color: rgba(255, 255, 255, calc(var(--tag-alpha, 0.9)));
  font-weight: var(--tag-weight, 500);
  cursor: default;
  transition: background 0.2s, transform 0.2s;
  white-space: nowrap;
}

.tag-chip:hover {
  transform: scale(1.05);
}

:global([data-theme="light"]) .tag-chip {
  background: rgba(107, 33, 168, calc(var(--tag-alpha, 0.5)));
  color: rgba(255, 255, 255, calc(var(--tag-alpha, 0.95)));
}

/* ===== 雷达图 + 分析 ===== */
.radar-analysis-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  min-height: 240px;
}

.radar-section {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-lg);
}

.ai-summary {
  margin: 0;
  padding: var(--space-md) var(--space-lg);
  background: rgba(99, 102, 241, 0.06);
  border-left: 3px solid var(--accent-primary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.ai-summary p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.summary-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--accent-primary);
}

.potential-area {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.potential-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.potential-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.potential-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.08);
  border: 1px dashed rgba(34, 211, 238, 0.3);
}

@media (max-width: 768px) {
  .radar-analysis-body {
    grid-template-columns: 1fr;
  }
  .radar-section {
    min-height: 260px;
  }
}

/* ===== 空状态 / 占位 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-3xl) var(--space-lg);
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.placeholder-card {
  opacity: 0.6;
}

.placeholder-text {
  color: var(--text-tertiary) !important;
}

/* ===== 骨架屏 ===== */
.skeleton-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-3xl) var(--space-xl);
}

.skeleton-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  animation: shimmer 1.5s infinite;
}

:global([data-theme="light"]) .skeleton-avatar {
  background: rgba(0, 0, 0, 0.06);
}

.skeleton-line {
  height: 14px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.06);
  animation: shimmer 1.5s infinite;
}

:global([data-theme="light"]) .skeleton-line {
  background: rgba(0, 0, 0, 0.06);
}

.skeleton-name { width: 180px; height: 24px; }
.skeleton-level { width: 100px; }
.skeleton-email { width: 160px; }

.skeleton-stats {
  display: flex;
  gap: var(--space-xl);
  margin-top: var(--space-md);
}

.skeleton-stat {
  width: 80px;
  height: 40px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}
</style>
