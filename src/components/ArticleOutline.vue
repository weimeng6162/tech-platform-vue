<template>
  <div 
    class="article-outline" 
    :class="{ 'is-hidden': isHidden }"
  >
    <div class="outline-header">
      <span class="outline-title">文章脉络</span>
      <div class="outline-actions">
        <span class="outline-count">{{ headings.length }} 个章节</span>
        <button 
          v-if="headings.length > 7" 
          class="expand-btn"
          @click="toggleExpand"
          title="展开/收起全部"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            :class="{ 'is-expanded': isExpanded }"
          >
            <polyline points="6 9 12 15 18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="outline-content">
      <nav class="outline-nav">
        <ul class="outline-list">
          <!-- 收起时显示的内容 -->
          <template v-if="!isExpanded && visibleHeadings.length > 0">
            <!-- 顶部省略提示 -->
            <li v-if="showTopEllipsis" class="outline-item ellipsis-item">
              <span class="ellipsis-text">···</span>
            </li>
            
            <li 
              v-for="heading in visibleHeadings" 
              :key="heading.id"
              class="outline-item"
              :class="[
                `level-${heading.level}`,
                { 'is-active': activeId === heading.id }
              ]"
              @click="scrollToHeading(heading.id)"
            >
              <span class="outline-link">
                <span v-if="heading.level === 1" class="level-marker h1"></span>
                <span v-else-if="heading.level === 2" class="level-marker h2"></span>
                <span v-else class="level-marker h3"></span>
                {{ heading.text }}
              </span>
            </li>
            
            <!-- 底部省略提示 -->
            <li v-if="showBottomEllipsis" class="outline-item ellipsis-item">
              <span class="ellipsis-text">···</span>
            </li>
          </template>
          
          <!-- 展开时显示全部内容 -->
          <li 
            v-else
            v-for="heading in headings" 
            :key="heading.id"
            class="outline-item"
            :class="[
              `level-${heading.level}`,
              { 'is-active': activeId === heading.id }
            ]"
            @click="scrollToHeading(heading.id)"
          >
            <span class="outline-link">
              <span v-if="heading.level === 1" class="level-marker h1"></span>
              <span v-else-if="heading.level === 2" class="level-marker h2"></span>
              <span v-else class="level-marker h3"></span>
              {{ heading.text }}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Heading {
  id: string
  text: string
  level: number
  element: HTMLElement
}

const props = defineProps<{
  articleSelector?: string
  visibleRange?: number
}>()

const headings = ref<Heading[]>([])
const activeId = ref<string>('')
const isHidden = ref(false)
const isExpanded = ref(false)

const articleSelector = computed(() => props.articleSelector || '.content')
const visibleRange = computed(() => props.visibleRange || 3)

let scrollTimeout: number | null = null
let observer: MutationObserver | null = null

const extractHeadings = () => {
  const article = document.querySelector(articleSelector.value)
  if (!article) return

  const headingElements = article.querySelectorAll('h1, h2, h3')
  const newHeadings: Heading[] = []

  headingElements.forEach((el, index) => {
    const level = parseInt(el.tagName.charAt(1))
    const id = el.id || `heading-${index}`
    if (!el.id) {
      el.id = id
    }
    
    newHeadings.push({
      id,
      text: el.textContent || '',
      level,
      element: el as HTMLElement
    })
  })

  headings.value = newHeadings
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const updateActiveHeading = () => {
  const windowHeight = window.innerHeight
  
  let currentId = ''
  
  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = headings.value[i]
    const rect = heading.element.getBoundingClientRect()
    
    if (rect.top <= windowHeight / 3) {
      currentId = heading.id
      break
    }
  }
  
  activeId.value = currentId
}

const handleScroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = window.setTimeout(() => {
    updateActiveHeading()
  }, 100)
}

const handleResize = () => {
  isHidden.value = window.innerWidth < 768
}

const setupObserver = () => {
  const article = document.querySelector(articleSelector.value)
  if (!article) return

  observer = new MutationObserver(() => {
    nextTick(() => {
      extractHeadings()
    })
  })

  observer.observe(article, {
    childList: true,
    subtree: true,
    characterData: true
  })
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 获取当前激活标题的索引
const activeIndex = computed(() => {
  return headings.value.findIndex(h => h.id === activeId.value)
})

// 计算可见的标题范围
const visibleHeadings = computed(() => {
  if (headings.value.length <= 7) {
    return headings.value
  }
  
  const range = visibleRange.value
  const activeIdx = activeIndex.value
  
  // 如果没有激活的标题，显示前7个
  if (activeIdx === -1) {
    return headings.value.slice(0, 7)
  }
  
  // 计算可见范围
  const start = Math.max(0, activeIdx - range)
  const end = Math.min(headings.value.length, activeIdx + range + 1)
  
  return headings.value.slice(start, end)
})

// 是否显示顶部省略号
const showTopEllipsis = computed(() => {
  if (headings.value.length <= 7) return false
  
  const range = visibleRange.value
  const activeIdx = activeIndex.value
  
  return activeIdx > range
})

// 是否显示底部省略号
const showBottomEllipsis = computed(() => {
  if (headings.value.length <= 7) return false
  
  const range = visibleRange.value
  const activeIdx = activeIndex.value
  
  return activeIdx < headings.value.length - range - 1
})

onMounted(() => {
  nextTick(() => {
    extractHeadings()
    updateActiveHeading()
    handleResize()
    setupObserver()
  })
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  if (observer) {
    observer.disconnect()
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

watch(articleSelector, () => {
  nextTick(() => {
    extractHeadings()
  })
})
</script>

<style scoped>
.article-outline {
  position: fixed;
  right: 24px;
  top: 200px;
  width: 240px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 100;
  transition: opacity 0.3s, transform 0.3s;
}

@media (max-width: 1200px) {
  .article-outline {
    right: 16px;
    width: 220px;
  }
}

@media (max-width: 768px) {
  .article-outline {
    display: none;
  }
}

.is-hidden {
  opacity: 0;
  transform: translateX(20px);
  pointer-events: none;
}

.outline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.outline-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
}

.outline-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.outline-count {
  font-size: 0.75rem;
  color: var(--text-secondary, #888);
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary, #888);
  transition: all 0.2s;
}

.expand-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary, #1a1a1a);
}

.expand-btn svg {
  transition: transform 0.3s ease;
}

.expand-btn svg.is-expanded {
  transform: rotate(180deg);
}

.outline-content {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  padding: 8px 0;
}

.outline-content::-webkit-scrollbar {
  width: 4px;
}

.outline-content::-webkit-scrollbar-track {
  background: transparent;
}

.outline-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.outline-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.outline-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.outline-item {
  cursor: pointer;
  padding: 6px 16px;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
}

.outline-item:hover {
  background: rgba(99, 102, 241, 0.08);
}

.outline-item.is-active {
  border-left-color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

.outline-item.is-active .outline-link {
  color: #6366f1;
  font-weight: 500;
}

.outline-item.level-2 {
  padding-left: 28px;
}

.outline-item.level-3 {
  padding-left: 40px;
}

.outline-item.ellipsis-item {
  padding: 4px 16px;
  text-align: center;
}

.ellipsis-text {
  font-size: 0.75rem;
  color: var(--text-secondary, #888);
  letter-spacing: 2px;
}

.outline-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  line-height: 1.5;
  transition: color 0.2s;
}

.level-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.level-marker.h1 {
  background: #6366f1;
}

.level-marker.h2 {
  background: #8b5cf6;
}

.level-marker.h3 {
  background: #a78bfa;
}

.outline-item.is-active .level-marker {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
</style>
