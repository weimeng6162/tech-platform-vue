<template>
  <div class="test-report">
    <h2 class="report-title">功能测试报告</h2>

    <!-- 测试统计 -->
    <div class="test-stats">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-label">总文章数</div>
          <div class="stat-value">{{ totalArticles }}</div>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-label">正常展示</div>
          <div class="stat-value">{{ displayedArticles }}</div>
        </div>
      </div>

      <div class="stat-card danger">
        <div class="stat-icon">🚫</div>
        <div class="stat-content">
          <div class="stat-label">已过滤</div>
          <div class="stat-value">{{ blockedArticles }}</div>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-label">含推广</div>
          <div class="stat-value">{{ warningArticles }}</div>
        </div>
      </div>
    </div>

    <!-- 功能验证列表 -->
    <div class="test-cases">
      <h3 class="cases-title">功能验证清单</h3>

      <div class="test-case" :class="{ passed: filterTest }">
        <div class="case-icon">{{ filterTest ? '✅' : '❌' }}</div>
        <div class="case-content">
          <div class="case-title">文章过滤功能</div>
          <div class="case-desc">
            劣质文章（营销软文、技术水文、安全拦截、提示词注入）应被自动过滤
          </div>
          <div class="case-result">
            预期过滤 {{ expectedBlocked }} 篇，实际过滤 {{ blockedArticles }} 篇
          </div>
        </div>
      </div>

      <div class="test-case" :class="{ passed: warningTest }">
        <div class="case-icon">{{ warningTest ? '✅' : '❌' }}</div>
        <div class="case-content">
          <div class="case-title">商业推广警示</div>
          <div class="case-desc">
            含商业推广标签的文章应显示橘红色警示边框和图标
          </div>
          <div class="case-result">
            预期 {{ expectedWarning }} 篇警示，实际 {{ warningArticles }} 篇警示
          </div>
        </div>
      </div>

      <div class="test-case" :class="{ passed: difficultyTest }">
        <div class="case-icon">{{ difficultyTest ? '✅' : '❌' }}</div>
        <div class="case-content">
          <div class="case-title">难度标识功能</div>
          <div class="case-desc">
            文章应正确显示初级(🌱)、中级(⚡)、深度(🚀)难度标识
          </div>
          <div class="case-result">
            初级 {{ difficultyCount.easy }} 篇，中级 {{ difficultyCount.medium }} 篇，深度
            {{ difficultyCount.deep }} 篇
          </div>
        </div>
      </div>

      <div class="test-case" :class="{ passed: collectTest }">
        <div class="case-icon">{{ collectTest ? '✅' : '❌' }}</div>
        <div class="case-content">
          <div class="case-title">收藏标记功能</div>
          <div class="case-desc">已收藏的文章应显示金色星星标记</div>
          <div class="case-result">已收藏 {{ collectedCount }} 篇文章</div>
        </div>
      </div>

      <div class="test-case" :class="{ passed: tagFilterTest }">
        <div class="case-icon">{{ tagFilterTest ? '✅' : '❌' }}</div>
        <div class="case-content">
          <div class="case-title">标签过滤功能</div>
          <div class="case-desc">
            安全标签（营销软文、技术水文等）不应显示，但"含商业推广"应保留
          </div>
          <div class="case-result">标签过滤正常工作</div>
        </div>
      </div>
    </div>

    <!-- 测试结论 -->
    <div class="test-conclusion" :class="{ success: allTestsPassed }">
      <div class="conclusion-icon">{{ allTestsPassed ? '🎉' : '⚠️' }}</div>
      <div class="conclusion-content">
        <div class="conclusion-title">
          {{ allTestsPassed ? '所有测试通过！' : '部分测试未通过' }}
        </div>
        <div class="conclusion-desc">
          {{
            allTestsPassed
              ? 'AI 内容安全识别功能运行正常，劣质文章已过滤，警示标识正确显示。'
              : '请检查未通过的测试项，确保功能正常运行。'
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleItem } from '../types/api'
import { isBlockedArticle, hasCommercialContent } from '../types/api'

const props = defineProps<{
  allArticles: ArticleItem[]
  displayedArticles: ArticleItem[]
}>()

// 统计数据
const totalArticles = computed(() => props.allArticles.length)
const blockedArticles = computed(() => props.allArticles.length - props.displayedArticles.length)
const warningArticles = computed(
  () => props.displayedArticles.filter((a) => hasCommercialContent(a.tags)).length
)

// 预期值
const expectedBlocked = 5 // 5篇劣质文章
const expectedWarning = 4 // 4篇含商业推广

// 难度统计
const difficultyCount = computed(() => {
  const count = { easy: 0, medium: 0, deep: 0 }
  props.displayedArticles.forEach((a) => {
    if (a.difficulty === '初级') count.easy++
    else if (a.difficulty === '中级') count.medium++
    else if (a.difficulty === '深度') count.deep++
  })
  return count
})

// 收藏统计
const collectedCount = computed(
  () => props.displayedArticles.filter((a) => a.is_collected).length
)

// 测试结果
const filterTest = computed(() => blockedArticles.value === expectedBlocked)
const warningTest = computed(() => warningArticles.value === expectedWarning)
const difficultyTest = computed(
  () => difficultyCount.value.easy > 0 && difficultyCount.value.medium > 0 && difficultyCount.value.deep > 0
)
const collectTest = computed(() => collectedCount.value > 0)
const tagFilterTest = computed(() => {
  // 检查显示的文章中没有安全标签（除了"含商业推广"）
  return props.displayedArticles.every((a) => {
    const securityTags = ['安全拦截', '提示词注入', '营销软文', '技术水文']
    return !a.tags.some((tag) => securityTags.includes(tag))
  })
})

const allTestsPassed = computed(
  () => filterTest.value && warningTest.value && difficultyTest.value && collectTest.value && tagFilterTest.value
)
</script>

<style scoped>
.test-report {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.report-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 2rem 0;
  text-align: center;
}

/* 统计卡片 */
.test-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  border: 2px solid var(--border-color);
  transition: all 0.3s;
}

.stat-card.success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.stat-card.danger {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.stat-card.warning {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.05);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* 测试用例 */
.test-cases {
  margin-bottom: 2rem;
}

.cases-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.test-case {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border: 2px solid var(--border-color);
  transition: all 0.3s;
}

.test-case.passed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.case-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.case-content {
  flex: 1;
}

.case-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.case-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.case-result {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-family: monospace;
}

/* 测试结论 */
.test-conclusion {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-tertiary);
}

.test-conclusion.success {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
}

.conclusion-icon {
  font-size: 3rem;
}

.conclusion-content {
  flex: 1;
}

.conclusion-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.conclusion-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
