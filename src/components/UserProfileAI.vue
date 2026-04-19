<template>
  <div class="user-profile-ai">
    <!-- 用户基本信息 -->
    <div class="user-header">
      <div class="avatar">
        <img :src="profile.avatar_url" :alt="profile.nickname" />
      </div>
      <div class="user-info">
        <h2 class="nickname">{{ profile.nickname }}</h2>
        <div class="tech-level">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ profile.ai_analysis.technical_level }}</span>
        </div>
      </div>
    </div>

    <!-- AI 专属评语 -->
    <div class="ai-profile-card">
      <div class="ai-badge">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>AI 专属画像</span>
      </div>
      <p class="ai-summary">{{ profile.ai_analysis.ai_profile_summary }}</p>
    </div>

    <!-- 核心技术栈 -->
    <div class="core-interests">
      <h3 class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2" />
          <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        核心技术栈
      </h3>
      <div class="interests-list">
        <div
          v-for="interest in profile.ai_analysis.core_interests"
          :key="interest.name"
          class="interest-item"
        >
          <div class="interest-header">
            <span class="interest-name">{{ interest.name }}</span>
            <span class="interest-weight">{{ interest.weight }}%</span>
          </div>
          <div class="interest-bar">
            <div
              class="interest-fill"
              :style="{
                width: `${interest.weight}%`,
                backgroundColor: getInterestColor(interest.weight),
              }"
            >
              <div class="interest-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术雷达图 -->
    <div class="tech-radar">
      <h3 class="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon
            points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        技术雷达
      </h3>
      <div class="radar-chart">
        <svg viewBox="0 0 200 200" class="radar-svg">
          <!-- 背景网格 -->
          <polygon
            v-for="i in 5"
            :key="`grid-${i}`"
            :points="getRadarGrid(i * 20)"
            fill="none"
            stroke="var(--border-color)"
            stroke-width="0.5"
            opacity="0.3"
          />
          <!-- 数据区域 -->
          <polygon
            :points="radarPoints"
            fill="url(#radarGradient)"
            stroke="var(--primary-color)"
            stroke-width="2"
          />
          <!-- 渐变定义 -->
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfileData } from '../types/api'

const props = defineProps<{
  profile: UserProfileData
}>()

// 根据权重获取颜色
const getInterestColor = (weight: number) => {
  if (weight >= 80) return '#10b981'
  if (weight >= 60) return '#3b82f6'
  if (weight >= 40) return '#f59e0b'
  return '#6b7280'
}

// 计算雷达图网格点
const getRadarGrid = (radius: number) => {
  const interests = props.profile.ai_analysis.core_interests
  const count = interests.length
  const points: string[] = []

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
}

// 计算雷达图数据点
const radarPoints = computed(() => {
  const interests = props.profile.ai_analysis.core_interests
  const count = interests.length
  const points: string[] = []

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const radius = (interests[i].weight / 100) * 80
    const x = 100 + radius * Math.cos(angle)
    const y = 100 + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
})
</script>

<style scoped>
.user-profile-ai {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

/* 用户头部 */
.user-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.tech-level {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 20px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

/* AI 专属评语卡片 */
.ai-profile-card {
  position: relative;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 12px;
  border: 2px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
}

.ai-profile-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 20px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.ai-summary {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0;
}

/* 核心技术栈 */
.core-interests {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.interests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.interest-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.interest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interest-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.interest-weight {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.interest-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.interest-fill {
  height: 100%;
  border-radius: 4px;
  position: relative;
  transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.interest-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 技术雷达图 */
.tech-radar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radar-chart {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.radar-svg {
  width: 100%;
  height: auto;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .ai-profile-card {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  }
}
</style>
