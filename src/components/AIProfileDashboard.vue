<template>
  <div class="dashboard">
    <div class="dashboard-left">
      <RadarChart :data="coreInterests" />
    </div>
    <div class="dashboard-right">
      <blockquote class="profile-summary">
        <Sparkles :size="16" class="summary-icon" />
        <p>{{ summary }}</p>
      </blockquote>
      <div v-if="potentialTags.length" class="potential-section">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import RadarChart from './RadarChart.vue'

interface CoreInterest {
  name: string
  weight: number
}

const props = defineProps<{
  coreInterests: CoreInterest[]
  summary: string
  potentialTags?: string[]
}>()

const potentialTags = computed(() => props.potentialTags ?? [])
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  align-items: start;
}

@media (max-width: 640px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}

.dashboard-left {
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-right {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.profile-summary {
  position: relative;
  margin: 0;
  padding: var(--space-lg);
  background: rgba(99, 102, 241, 0.06);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--accent-primary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.75;
  font-style: normal;
}

.summary-icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  color: var(--accent-primary);
}

.profile-summary p {
  margin: 0;
  display: inline;
}

.potential-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.potential-label {
  font-size: 0.8rem;
  font-weight: 600;
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
  display: inline-flex;
  align-items: center;
  padding: 4px var(--space-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: var(--radius-full);
  transition: all 0.3s ease;
}

.potential-tag:hover {
  background: rgba(34, 211, 238, 0.15);
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.15);
}
</style>
