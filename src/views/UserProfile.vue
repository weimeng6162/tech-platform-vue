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
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img
              v-if="profile.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.nickname"
              class="avatar-img"
            />
            <span v-else class="avatar-placeholder">{{ profile.nickname?.[0] ?? '?' }}</span>
            <div class="avatar-ring" />
          </div>
          <div class="profile-info">
            <h1 class="nickname">{{ profile.nickname }}</h1>
            <p class="technical-level">{{ profile.ai_analysis?.technical_level ?? '技术探索者' }}</p>
          </div>
        </div>

        <div class="profile-body">
          <AIProfileDashboard
            :core-interests="profile.ai_analysis?.core_interests ?? []"
            :summary="profile.ai_analysis?.ai_profile_summary ?? ''"
            :potential-tags="potentialTags"
          />
        </div>
      </div>

      <div class="profile-card">
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
import { UserX } from 'lucide-vue-next'
import { getUserProfile } from '../api/modules/user'
import AIProfileDashboard from '../components/AIProfileDashboard.vue'
import AssetTabs from '../components/AssetTabs.vue'
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
    const res = await getUserProfile()
    profile.value = res as unknown as UserProfileResponse
  } catch {
    profile.value = null
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
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ===== 卡片容器 ===== */
.profile-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  transition: border-color 0.3s ease;
}

.profile-card:hover {
  border-color: var(--border-glow);
}

/* ===== 头部 ===== */
.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-primary);
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
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

.nickname {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.technical-level {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.08);
  display: inline-block;
  padding: 3px var(--space-sm);
  border-radius: var(--radius-full);
  border: 1px solid rgba(34, 211, 238, 0.2);
}

.profile-body {
  display: flex;
  flex-direction: column;
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
