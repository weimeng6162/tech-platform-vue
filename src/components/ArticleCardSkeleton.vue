<template>
  <div class="skeleton-card">
    <!-- 封面骨架 -->
    <div class="skeleton-cover">
      <Skeleton variant="rect" height="150px" />
    </div>

    <!-- 内容骨架 -->
    <div class="skeleton-content">
      <!-- 标题 -->
      <Skeleton variant="text" height="24px" width="80%" />

      <!-- 摘要 -->
      <div class="skeleton-summary">
        <Skeleton variant="text" height="16px" width="100%" />
        <Skeleton variant="text" height="16px" width="90%" />
      </div>

      <!-- 标签 -->
      <div class="skeleton-tags">
        <Skeleton variant="rect" height="24px" width="60px" />
        <Skeleton variant="rect" height="24px" width="80px" />
        <Skeleton variant="rect" height="24px" width="70px" />
      </div>

      <!-- 底部信息 -->
      <div class="skeleton-footer">
        <div class="skeleton-author">
          <Skeleton variant="circle" width="26px" height="26px" />
          <Skeleton variant="text" height="14px" width="80px" />
        </div>
        <div class="skeleton-stats">
          <Skeleton variant="text" height="14px" width="50px" />
          <Skeleton variant="text" height="14px" width="50px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue'
</script>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-cover {
  height: 150px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
}

.skeleton-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.skeleton-tags {
  display: flex;
  gap: var(--space-xs);
}

.skeleton-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-primary);
}

.skeleton-author {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.skeleton-stats {
  display: flex;
  gap: var(--space-sm);
}

/* Dark mode */
:global([data-theme="dark"]) .skeleton-card {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
}

:global([data-theme="dark"]) .skeleton-footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}
</style>
