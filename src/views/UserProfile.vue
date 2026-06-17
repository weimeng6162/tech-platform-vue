<template>
  <div class="profile-page">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <div class="profile-card skeleton-card">
        <div class="profile-header">
          <div class="skeleton-avatar" />
          <div class="skeleton-info">
            <div class="skeleton-line skeleton-name" />
            <div class="skeleton-line skeleton-level" />
          </div>
        </div>
        <div class="skeleton-dashboard">
          <div class="skeleton-radar" />
          <div class="skeleton-summary">
            <div class="skeleton-line w-90" />
            <div class="skeleton-line w-70" />
            <div class="skeleton-line w-80" />
          </div>
        </div>
      </div>
    </template>

    <!-- 主体内容 -->
    <template v-else-if="profile">
      <!-- 顶部：头像 + 基本信息 + 数据卡片 -->
      <div class="top-row">
        <div class="profile-card profile-hero">
          <div class="avatar-wrapper">
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.username"
              class="avatar-img"
            />
            <span v-else class="avatar-placeholder">{{ profile.username?.[0] ?? '?' }}</span>
            <div class="avatar-ring" />
          </div>
          <div class="profile-info">
            <h1 class="nickname">{{ profile.username }}</h1>
            <p class="technical-level">{{ profile.ai_analysis?.technical_level ?? '技术探索者' }}</p>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon interests">
              <Target :size="18" />
            </div>
            <div class="stat-num">{{ (profile.ai_analysis?.core_interests ?? []).length }}</div>
            <div class="stat-label">兴趣领域</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon level">
              <Award :size="18" />
            </div>
            <div class="stat-num">{{ profile.ai_analysis?.technical_level ?? '--' }}</div>
            <div class="stat-label">技术评级</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon tags">
              <Hash :size="18" />
            </div>
            <div class="stat-num">{{ potentialTags.length }}</div>
            <div class="stat-label">核心标签</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon configured">
              <ShieldCheck :size="18" />
            </div>
            <div class="stat-num">{{ profile.is_configured ? '是' : '否' }}</div>
            <div class="stat-label">偏好设置</div>
          </div>
        </div>
      </div>

      <!-- AI 画像仪表盘 -->
      <div class="profile-card">
        <div class="card-header">
          <Sparkles :size="18" />
          <h3>AI 技术画像</h3>
        </div>
        <AIProfileDashboard
          :core-interests="profile.ai_analysis?.core_interests ?? []"
          :summary="profile.ai_analysis?.ai_profile_summary ?? ''"
          :potential-tags="potentialTags"
        />
      </div>

      <!-- 足迹 & 收藏 -->
      <div class="profile-card">
        <div class="card-header">
          <Layers :size="18" />
          <h3>内容资产</h3>
        </div>
        <AssetTabs />
      </div>
    </template>

    <!-- 请求失败占位 -->
    <template v-else>
      <div class="profile-card placeholder-card">
        <div class="profile-header placeholder-header">
          <div class="avatar-wrapper">
            <span class="avatar-placeholder static">?</span>
          </div>
          <div class="profile-info">
            <h1 class="nickname placeholder-text">未登录用户</h1>
            <p class="technical-level placeholder-text">暂无评级</p>
          </div>
        </div>
        <div class="profile-body">
          <div class="dashboard-placeholder">
            <UserX :size="28" />
            <span>暂未生成画像，请稍后查看</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserX, Target, Award, Hash, ShieldCheck, Sparkles, Layers } from 'lucide-vue-next'
import AIProfileDashboard from '../components/AIProfileDashboard.vue'
import AssetTabs from '../components/AssetTabs.vue'
import { getUserInfo } from '../api/modules/user'
import { MOCK_USER_PROFILE_RESPONSE } from '../api/mock'
import type { UserProfileResponse } from '../api/types'

const profile = ref<UserProfileResponse | null>(null)
const loading = ref(true)

const potentialTags = computed(() => {
  const interests = profile.value?.ai_analysis?.core_interests ?? []
  return interests
    .filter((i) => i.weight >= 60)
    .map((i) => i.name)
})

async function fetchProfile() {
  loading.value = true
  try {
    const info = await getUserInfo()
    profile.value = {
      user_id: '',
      username: info.username,
      avatar_url: info.avatar_url,
      is_configured: true,
      ai_analysis: MOCK_USER_PROFILE_RESPONSE.ai_analysis,
    }
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
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ===== 卡片容器 ===== */
.profile-card {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  transition: border-color 0.3s ease;
}

.profile-card:hover {
  border-color: var(--border-glow);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-primary);
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-header :deep(svg) {
  color: var(--accent-primary);
}

/* ===== 顶部双栏 ===== */
.top-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .top-row {
    grid-template-columns: 1fr;
  }
}

/* ===== 头像卡片 ===== */
.profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
}

.avatar-wrapper {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(99, 102, 241, 0.3);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  background: var(--accent-gradient);
  border: 2px solid rgba(99, 102, 241, 0.4);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: rgba(34, 211, 238, 0.5);
  animation: ringRotate 3s linear infinite;
  pointer-events: none;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nickname {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.technical-level {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.08);
  display: inline-block;
  padding: 3px 12px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.profile-meta-row {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-primary);
  width: 100%;
  justify-content: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.meta-item :deep(svg) {
  opacity: 0.6;
}

/* ===== 统计卡片 ===== */
.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--space-lg) var(--space-md);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.interests { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.stat-icon.level { background: linear-gradient(135deg, #f59e0b, #ef4444); }
.stat-icon.tags { background: linear-gradient(135deg, #06b6d4, #22d3ee); }
.stat-icon.configured { background: linear-gradient(135deg, #10b981, #34d399); }

.stat-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ===== 骨架屏通用头部 ===== */
.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-primary);
}

/* ===== 骷髅屏 ===== */
.skeleton-card {
  pointer-events: none;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.skeleton-line {
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  animation: shimmer 1.5s infinite;
}

:global([data-theme="light"]) .skeleton-avatar,
:global([data-theme="light"]) .skeleton-line {
  background: rgba(0, 0, 0, 0.06);
}

.skeleton-name { width: 160px; height: 20px; }
.skeleton-level { width: 100px; }

.skeleton-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  min-height: 300px;
}

@media (max-width: 640px) {
  .skeleton-dashboard {
    grid-template-columns: 1fr;
  }
}

.skeleton-radar {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  animation: shimmer 1.5s infinite;
  min-height: 280px;
}

.skeleton-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
}

.w-90 { width: 90%; }
.w-70 { width: 70%; }
.w-80 { width: 80%; }

@keyframes shimmer {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}

/* ===== 请求失败占位 ===== */
.placeholder-card {
  opacity: 0.6;
  pointer-events: none;
}

.placeholder-header {
  border-bottom-color: var(--border-primary);
}

.placeholder-text {
  color: var(--text-tertiary) !important;
}

.avatar-placeholder.static {
  animation: none;
}

.dashboard-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-3xl) var(--space-lg);
  color: var(--text-tertiary);
  font-size: 0.9rem;
}
</style>
