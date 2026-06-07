<template>
  <div class="article-detail-page">
    <div class="container">
      <!-- 文章头部 -->
      <header class="article-header">
        <div class="category-badge">{{ article.category }}</div>
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta">
          <span class="author">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="7" r="4" stroke-width="2" />
            </svg>
            {{ article.author }}
          </span>
          <span class="time">{{ formatTime(article.publish_time) }}</span>
          <span class="views">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke-width="2" />
            </svg>
            {{ article.metrics.view_count }}
          </span>
        </div>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <!-- AI 摘要卡片 - 极其显眼的极客 UI -->
      <div class="ai-summary-card">
        <div class="ai-header">
          <div class="ai-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="ai-glow"></div>
          </div>
          <div class="ai-title">
            <span class="ai-label">AI</span>
            <span class="ai-text">核心摘要</span>
          </div>
        </div>
        <p class="ai-content">{{ article.ai_summary }}</p>
      </div>

      <!-- 商业推广警示 -->
      <SecurityWarning
        v-if="hasWarning"
        type="warning"
        title="检测到商业推广内容"
        message="该文章包含技术干货，但文末夹带了商业推广信息，请知悉。"
      />

      <!-- 文章正文 -->
      <article class="article-content">
        <MarkdownRenderer :content="article.content" />
      </article>

      <!-- 文章脉络图 -->
      <ArticleOutline article-selector=".article-content" />

      <!-- 文章底部 -->
      <footer class="article-footer">
        <!-- 互动数据 -->
        <div class="metrics">
          <div class="metric-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke-width="2" />
            </svg>
            <span>{{ article.metrics.view_count }} 阅读</span>
          </div>
          <div class="metric-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.metrics.like_count }} 点赞</span>
          </div>
          <div class="metric-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.metrics.collect_count }} 收藏</span>
          </div>
        </div>

        <!-- 互动按钮 -->
        <div class="actions">
          <button
            class="action-btn"
            :class="{ active: article.interaction_status.is_liked }"
            @click="handleLike"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.interaction_status.is_liked ? '已点赞' : '点赞' }}</span>
            <span class="action-count">{{ article.metrics.like_count }}</span>
          </button>
          <button
            class="action-btn"
            :class="{ active: article.interaction_status.is_collected }"
            @click="handleCollect"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.interaction_status.is_collected ? '已收藏' : '收藏' }}</span>
            <span class="action-count">{{ article.metrics.collect_count }}</span>
          </button>
          <button class="action-btn" @click="handleShare">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="18" cy="5" r="3" stroke-width="2" />
              <circle cx="6" cy="12" r="3" stroke-width="2" />
              <circle cx="18" cy="19" r="3" stroke-width="2" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-width="2" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-width="2" />
            </svg>
            <span>分享</span>
          </button>
        </div>
      </footer>

      <!-- 评论区 -->
      <section class="comments-section">
        <!-- 排序与计数栏 -->
        <div class="comments-header">
          <div class="comments-header-left">
            <button class="collapse-btn" @click="toggleCommentsCollapse">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                :class="{ rotated: isCommentsCollapsed }"
              >
                <polyline points="6 9 12 15 18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <span class="comments-count">共 {{ totalComments }} 条评论</span>
          </div>
          <div class="sort-buttons">
            <button
              class="sort-btn"
              :class="{ active: sortBy === 'hot' }"
              @click="sortBy = 'hot'"
            >
              最热
            </button>
            <span class="sort-divider">|</span>
            <button
              class="sort-btn"
              :class="{ active: sortBy === 'new' }"
              @click="sortBy = 'new'"
            >
              最新
            </button>
          </div>
        </div>

        <!-- 折叠内容区域 -->
        <div v-show="!isCommentsCollapsed" class="comments-content">
          <!-- 评论输入区 -->
          <div class="comment-input-wrapper">
            <div class="input-header">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=you" class="user-avatar" alt="avatar" />
              <div class="input-container">
                <textarea
                  v-model="newComment"
                  class="comment-textarea"
                  :class="{ focused: isInputFocused }"
                  placeholder="输入你想说的话... 支持 Markdown 和代码块"
                  @focus="isInputFocused = true"
                  @blur="isInputFocused = false"
                  rows="3"
                ></textarea>
                
                <!-- 工具栏 -->
                <div class="toolbar">
                  <div class="toolbar-left">
                    <button class="tool-btn" @click="insertCode" title="插入代码块">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="16 18 22 12 16 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <polyline points="8 6 2 12 8 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <button class="tool-btn" @click="insertBold" title="粗体">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke-width="2" />
                        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke-width="2" />
                      </svg>
                    </button>
                    <button class="tool-btn" @click="insertLink" title="链接">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <button class="tool-btn" @click="togglePreview">
                      {{ isPreview ? '编辑' : '预览' }}
                    </button>
                  </div>
                  <button class="submit-btn" @click="submitComment" :disabled="!newComment.trim()">
                    发表评论
                  </button>
                </div>
                
                <!-- 预览 -->
                <div v-if="isPreview" class="preview-wrapper">
                  <div class="preview-label">预览</div>
                  <MarkdownRenderer :content="newComment || '暂无内容'" />
                </div>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
          <div v-for="comment in displayedComments" :key="comment.comment_id" class="comment-item">
            <!-- 主评论 -->
            <div class="comment-main">
              <img :src="comment.avatar_url" class="comment-avatar" alt="avatar" />
              <div class="comment-content-wrapper">
                <div class="comment-meta">
                  <span class="comment-author">{{ comment.username }}</span>
                  <span v-if="comment.username === 'Go夜读(作者)'" class="author-badge">作者</span>
                  <span class="comment-time">{{ formatCommentTime(comment.created_at) }}</span>
                </div>
                <div class="comment-body">
                  <MarkdownRenderer :content="comment.content" />
                </div>
                <div class="comment-actions">
                  <button 
                    class="action-link" 
                    :class="{ active: comment.is_liked }"
                    @click="toggleCommentLike(comment)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ comment.like_count }}
                  </button>
                  <button class="action-link" @click="startReply(comment)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9 17 4 12 9 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M20 18v-2a4 4 0 0 0-4-4H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    回复
                  </button>
                  <button v-if="comment.username === '你'" class="action-link delete-btn" @click="deleteComment(comment)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    删除
                  </button>
                </div>
              </div>
            </div>

            <!-- 回复输入框 -->
            <div v-if="replyingTo === comment.comment_id" class="reply-input-wrapper">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=you" class="reply-avatar" alt="avatar" />
              <div class="reply-input-container">
                <div class="reply-quote">
                  @{{ comment.username }}：{{ comment.content.substring(0, 50) }}{{ comment.content.length > 50 ? '...' : '' }}
                </div>
                <textarea
                  v-model="replyText"
                  class="reply-textarea"
                  placeholder="回复 @{{ comment.username }}"
                  rows="2"
                ></textarea>
                <div class="reply-actions">
                  <button class="cancel-btn" @click="cancelReply">取消</button>
                  <button class="submit-reply-btn" @click="submitReply(comment)" :disabled="!replyText.trim()">
                    发送
                  </button>
                </div>
              </div>
            </div>

            <!-- 回复列表 -->
            <div v-if="comment.replies && comment.replies.length > 0" class="replies-wrapper">
              <div class="thread-line"></div>
              <div class="replies-list">
                <div v-for="reply in comment.replies" :key="reply.comment_id" class="reply-item">
                  <img :src="reply.avatar_url" class="reply-avatar-small" alt="avatar" />
                  <div class="reply-content-wrapper">
                    <div class="reply-meta">
                      <span class="reply-author">{{ reply.username }}</span>
                      <span v-if="reply.username === 'Go夜读(作者)'" class="author-badge">作者</span>
                      <span class="reply-time">{{ formatCommentTime(reply.created_at) }}</span>
                    </div>
                    <div class="reply-body">
                      <template v-if="reply.reply_to_username">
                        <span class="mention">@{{ reply.reply_to_username }}</span>
                        <MarkdownRenderer :content="reply.content" />
                      </template>
                      <template v-else>
                        <MarkdownRenderer :content="reply.content" />
                      </template>
                    </div>
                    <div class="reply-actions-bottom">
                      <button 
                        class="action-link" 
                        :class="{ active: reply.is_liked }"
                        @click="toggleReplyLike(reply)"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {{ reply.like_count }}
                      </button>
                      <button class="action-link" @click="startReply(comment, reply)">
                        回复
                      </button>
                      <button v-if="reply.username === '你'" class="action-link delete-btn" @click="deleteReply(comment, reply)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 关闭 comments-content -->
        </div>
      </section>

      <!-- 展开更多 -->
      <div v-if="hasMoreComments" class="load-more-wrapper">
        <button class="load-more-btn" @click="toggleCommentsExpand">
          展开更多评论 ({{ sortedComments.length - 3 }} 条)
        </button>
      </div>

      <!-- 收起评论 -->
      <div v-if="isCommentsExpanded && sortedComments.length > 3" class="load-more-wrapper">
        <button class="load-more-btn" @click="toggleCommentsExpand">
          收起评论
        </button>
      </div>

      <!-- 相关文章推荐 -->
      <div class="related-articles-section">
        <h3 class="related-articles-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-right: 0.5rem;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <polyline points="14 2 14 8 20 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="16" y1="17" x2="8" y2="17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <polyline points="10 9 9 9 8 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          相关文章推荐
        </h3>
        <div class="related-articles-list">
          <div 
            v-for="article in relatedArticles" 
            :key="article.article_id"
            class="related-article-item"
            @click="goToArticle(article.article_id)"
          >
            <div class="related-article-content">
              <h4 class="related-article-title">{{ article.title }}</h4>
              <div class="related-article-meta">
                <span class="related-article-author">{{ article.author }}</span>
                <span class="related-article-time">{{ article.publish_time }}</span>
                <span class="related-article-views">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke-width="2" />
                  </svg>
                  {{ article.view_count }}
                </span>
              </div>
            </div>
            <svg class="related-article-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="9 18 15 12 9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import SecurityWarning from '../components/SecurityWarning.vue'
import ArticleOutline from '../components/ArticleOutline.vue'
import { recommendArticlesData, articleDetailData, getArticleContent } from '../data/mockData'
import { hasCommercialContent } from '../types/api'
import { addRecentArticle } from '../stores/recentArticles'
import { toggleCollectedArticle, isArticleCollected } from '../stores/collectedArticles'
import { 
  getArticleComments, 
  createComment, 
  commentAction, 
  articleAction 
} from '../api/modules/article'

const route = useRoute()
const router = useRouter()

// 获取文章 ID
const articleId = computed(() => route.params.id as string || route.query.id as string || 'wx_9527')

// 从推荐列表中查找文章
const articleFromList = computed(() => {
  return recommendArticlesData.data.article_list.find(a => a.article_id === articleId.value)
})

// 使用 ref 存储文章数据，避免每次访问都重新计算
const article = ref({
  article_id: '',
  title: '',
  author: '',
  publish_time: '',
  category: '',
  ai_summary: '',
  tags: [] as string[],
  content: '',
  metrics: {
    view_count: 0,
    like_count: 0,
    collect_count: 0,
  },
  interaction_status: {
    is_liked: false,
    is_collected: isArticleCollected(articleId.value),
  },
})

// 检查是否包含商业推广
const hasWarning = computed(() => hasCommercialContent(article.value.tags))

// 评论状态
const newComment = ref('')
const isCommentsCollapsed = ref(false)
const replyText = ref('')
const isInputFocused = ref(false)
const isPreview = ref(false)
const sortBy = ref<'hot' | 'new'>('hot')
const replyingTo = ref<string | null>(null)

// 评论数据结构（匹配API返回）
interface CommentReply {
  comment_id: string
  user_id: string
  username: string
  avatar_url: string
  reply_to_user_id: string
  reply_to_username: string
  content: string
  like_count: number
  is_liked: boolean
  created_at: string
}

interface Comment {
  comment_id: string
  user_id: string
  username: string
  avatar_url: string
  content: string
  like_count: number
  is_liked: boolean
  created_at: string
  replies?: CommentReply[]
}

// 评论相关状态
const comments = ref<Comment[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(false)
const hasMore = ref(true)

// 加载评论列表
const loadComments = async (page: number = 1, append: boolean = false) => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    const response = await getArticleComments(articleId.value, page, pageSize.value)
    
    if (append) {
      comments.value = [...comments.value, ...response.comments]
    } else {
      comments.value = response.comments
    }
    
    currentPage.value = response.page
    hasMore.value = response.page * response.size < response.total
  } catch (error) {
    console.error('加载评论失败:', error)
    // 如果API失败，使用mock数据作为降级
    loadMockComments()
  } finally {
    isLoading.value = false
  }
}

// 加载Mock评论数据（降级方案）
const loadMockComments = () => {
  comments.value = [
    {
      comment_id: '1001',
      user_id: 'dev_045',
      username: 'Linux狂热者',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linuxfan',
      content: '作者对 GMP 源码解析太透彻了！',
      like_count: 42,
      is_liked: true,
      created_at: '2026-04-18T11:05:00Z',
      replies: [
        {
          comment_id: '1005',
          user_id: 'dev_102',
          username: 'Go夜读(作者)',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=goauthor',
          reply_to_user_id: 'dev_045',
          reply_to_username: 'Linux狂热者',
          content: '感谢认可！',
          like_count: 15,
          is_liked: false,
          created_at: '2026-04-18T11:30:00Z'
        }
      ]
    },
    {
      comment_id: '1002',
      user_id: 'dev_089',
      username: '前端大牛',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend',
      content: '这里确实需要注意，很多新人在 `useEffect` 里用 `setInterval` 很容易忘记清除定时器，导致内存泄漏。',
      like_count: 24,
      is_liked: false,
      created_at: '2026-04-18T10:20:00Z',
      replies: []
    },
    {
      comment_id: '1003',
      user_id: 'dev_156',
      username: '架构师张三',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      content: '写得很清晰！不过我建议补充一下 `requestAnimationFrame` 的使用场景。',
      like_count: 18,
      is_liked: false,
      created_at: '2026-04-18T09:45:00Z',
      replies: []
    }
  ]
  hasMore.value = false
}

// 相关文章推荐数据
const relatedArticles = computed(() => {
  const currentId = articleId.value
  const currentArticle = article.value
  
  // 获取当前文章的标签
  const currentTags = currentArticle.tags || []
  
  // 从推荐列表中筛选相关文章（有相同标签的优先）
  const allArticles = recommendArticlesData.data.article_list
    .filter(a => a.article_id !== currentId)
    .map(a => {
      // 计算与当前文章的标签匹配度
      const matchScore = a.tags?.filter(t => currentTags.includes(t)).length || 0
      return {
        ...a,
        matchScore
      }
    })
    // 按匹配度排序，匹配度高的在前
    .sort((a, b) => b.matchScore - a.matchScore)
    // 取前 3 篇
    .slice(0, 3)
  
  return allArticles.map(a => ({
    article_id: a.article_id,
    title: a.title,
    author: a.author,
    publish_time: a.publish_time,
    view_count: a.view_count,
  }))
})

// 跳转到文章详情
const goToArticle = (articleId: string) => {
  console.log('跳转到文章:', articleId)
  router.push({ path: `/article/${articleId}` })
}

// 排序后的评论
const sortedComments = computed(() => {
  const sorted = [...comments.value]
  if (sortBy.value === 'hot') {
    sorted.sort((a, b) => b.like_count - a.like_count)
  } else {
    sorted.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return timeB - timeA
    })
  }
  return sorted
})

// 格式化评论时间
const formatCommentTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 评论展开状态
const isCommentsExpanded = ref(false) // 评论区是否已展开

// 显示的评论
const displayedComments = computed(() => {
  if (!isCommentsExpanded.value) {
    // 未展开时只显示 3 条
    return sortedComments.value.slice(0, 3)
  }
  // 展开后显示所有评论
  return sortedComments.value
})

// 是否有更多评论
const hasMoreComments = computed(() => {
  return !isCommentsExpanded.value && sortedComments.value.length > 3
})

// 展开/收起评论
const toggleCommentsExpand = () => {
  isCommentsExpanded.value = !isCommentsExpanded.value
}

// 总评论数（包括回复）
const totalComments = computed(() => {
  let count = sortedComments.value.length
  sortedComments.value.forEach(comment => {
    if (comment.replies) {
      count += comment.replies.length
    }
  })
  return count
})

// 滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo(0, 0)
}

// 记录阅读历史
const recordReading = () => {
  if (articleFromList.value) {
    addRecentArticle(articleFromList.value)
  }
}

// 监听路由变化
watch(() => [route.params.id, route.query.id], () => {
  scrollToTop()
  recordReading()
})

// 组件挂载时
onMounted(() => {
  scrollToTop()
  recordReading()
  loadComments()
  
  // 初始化文章数据
  const found = articleFromList.value
  article.value = {
    article_id: found?.article_id || articleDetailData.data.article_id,
    title: found?.title || articleDetailData.data.title,
    author: found?.author || articleDetailData.data.author,
    publish_time: found?.publish_time || articleDetailData.data.publish_time,
    category: found?.category || articleDetailData.data.category,
    ai_summary: found?.ai_summary || articleDetailData.data.ai_summary,
    tags: found?.tags || articleDetailData.data.tags,
    content: getArticleContent(articleId.value),
    metrics: {
      view_count: found?.view_count || articleDetailData.data.metrics.view_count,
      like_count: Math.floor(Math.random() * 500) + 100,
      collect_count: Math.floor(Math.random() * 100) + 20,
    },
    interaction_status: {
      is_liked: false,
      is_collected: isArticleCollected(articleId.value),
    },
  }
})

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 处理点赞（乐观UI）
const handleLike = async () => {
  // 乐观更新UI
  const wasLiked = article.value.interaction_status.is_liked
  article.value.interaction_status.is_liked = !wasLiked
  if (article.value.interaction_status.is_liked) {
    article.value.metrics.like_count++
  } else {
    article.value.metrics.like_count--
  }
  
  // 发送请求
  try {
    await articleAction({
      article_id: article.value.article_id,
      action_type: article.value.interaction_status.is_liked ? 1 : 2
    })
  } catch (error) {
    // 请求失败，回滚状态
    article.value.interaction_status.is_liked = wasLiked
    if (article.value.interaction_status.is_liked) {
      article.value.metrics.like_count++
    } else {
      article.value.metrics.like_count--
    }
    console.error('点赞失败:', error)
  }
}

// 处理收藏（乐观UI）
const handleCollect = async () => {
  // 乐观更新UI
  const wasCollected = article.value.interaction_status.is_collected
  article.value.interaction_status.is_collected = !wasCollected
  if (article.value.interaction_status.is_collected) {
    article.value.metrics.collect_count++
  } else {
    article.value.metrics.collect_count--
  }
  
  // 更新本地收藏状态
  if (articleFromList.value) {
    toggleCollectedArticle(articleFromList.value)
  }
  
  // 发送请求
  try {
    await articleAction({
      article_id: article.value.article_id,
      action_type: article.value.interaction_status.is_collected ? 2 : 1
    })
  } catch (error) {
    // 请求失败，回滚状态
    article.value.interaction_status.is_collected = wasCollected
    if (article.value.interaction_status.is_collected) {
      article.value.metrics.collect_count++
    } else {
      article.value.metrics.collect_count--
    }
    console.error('收藏失败:', error)
  }
}

// 处理分享
const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value.title,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

// 插入代码块
const insertCode = () => {
  newComment.value += '\n```javascript\n// 你的代码\n```\n'
}

// 插入粗体
const insertBold = () => {
  newComment.value += '****'
}

// 插入链接
const insertLink = () => {
  newComment.value += '[链接文字](https://)'
}

// 切换预览
const togglePreview = () => {
  isPreview.value = !isPreview.value
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  // 构建评论数据
  const commentData = {
    article_id: articleId.value,
    content: newComment.value,
    parent_id: '0', // 一级评论
    reply_to_user_id: ''
  }
  
  try {
    // 发送请求
    await createComment(commentData)
    
    // 成功后添加到本地列表（乐观更新）
    const newCommentItem: Comment = {
      comment_id: Date.now().toString(),
      user_id: 'current_user',
      username: '你',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      content: newComment.value,
      like_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      replies: []
    }
    
    comments.value.unshift(newCommentItem)
    newComment.value = ''
    isPreview.value = false
  } catch (error) {
    console.error('发表评论失败:', error)
    alert('发表评论失败，请稍后重试')
  }
}

// 开始回复
const startReply = (comment: Comment, reply?: CommentReply) => {
  replyingTo.value = comment.comment_id
  if (reply) {
    replyText.value = `@${reply.username} `
  } else {
    replyText.value = ''
  }
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyText.value = ''
}

// 删除评论
const deleteComment = (comment: Comment) => {
  if (confirm('确定要删除这条评论吗？')) {
    const index = comments.value.findIndex(c => c.comment_id === comment.comment_id)
    if (index !== -1) {
      comments.value.splice(index, 1)
    }
  }
}

// 删除回复
const deleteReply = (comment: Comment, reply: CommentReply) => {
  if (confirm('确定要删除这条回复吗？')) {
    const index = comment.replies?.findIndex(r => r.comment_id === reply.comment_id)
    if (index !== undefined && index !== -1 && comment.replies) {
      comment.replies.splice(index, 1)
    }
  }
}

// 提交回复
const submitReply = async (comment: Comment) => {
  if (!replyText.value.trim()) return
  
  // 处理@某某的情况
  const mentionRegex = /^@(\S+)\s*/
  const match = replyText.value.match(mentionRegex)
  const replyToUsername = match ? match[1] : undefined
  const content = replyToUsername 
    ? replyText.value.replace(mentionRegex, '') 
    : replyText.value
  
  // 构建回复数据
  const replyData = {
    article_id: articleId.value,
    content: content,
    parent_id: comment.comment_id,
    reply_to_user_id: replyToUsername ? 'target_user_id' : ''
  }
  
  try {
    // 发送请求
    await createComment(replyData)
    
    // 成功后添加到本地列表
    const newReply: CommentReply = {
      comment_id: `${comment.comment_id}-${Date.now()}`,
      user_id: 'current_user',
      username: '你',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      reply_to_user_id: replyToUsername ? 'target_user_id' : '',
      reply_to_username: replyToUsername || '',
      content: replyText.value,
      like_count: 0,
      is_liked: false,
      created_at: new Date().toISOString()
    }
    
    if (!comment.replies) {
      comment.replies = []
    }
    comment.replies.push(newReply)
    
    replyingTo.value = null
    replyText.value = ''
  } catch (error) {
    console.error('发表回复失败:', error)
    alert('发表回复失败，请稍后重试')
  }
}

// 切换评论区折叠
const toggleCommentsCollapse = () => {
  isCommentsCollapsed.value = !isCommentsCollapsed.value
}

// 评论点赞（乐观UI）
const toggleCommentLike = async (comment: Comment) => {
  // 乐观更新UI
  const wasLiked = comment.is_liked
  comment.is_liked = !wasLiked
  if (comment.is_liked) {
    comment.like_count++
  } else {
    comment.like_count--
  }
  
  // 发送请求
  try {
    await commentAction({
      comment_id: comment.comment_id,
      action_type: comment.is_liked ? 1 : 2
    })
  } catch (error) {
    // 请求失败，回滚状态
    comment.is_liked = wasLiked
    if (comment.is_liked) {
      comment.like_count++
    } else {
      comment.like_count--
    }
    console.error('评论点赞失败:', error)
  }
}

// 回复点赞（乐观UI）
const toggleReplyLike = async (reply: CommentReply) => {
  // 乐观更新UI
  const wasLiked = reply.is_liked
  reply.is_liked = !wasLiked
  if (reply.is_liked) {
    reply.like_count++
  } else {
    reply.like_count--
  }
  
  // 发送请求
  try {
    await commentAction({
      comment_id: reply.comment_id,
      action_type: reply.is_liked ? 1 : 2
    })
  } catch (error) {
    // 请求失败，回滚状态
    reply.is_liked = wasLiked
    if (reply.is_liked) {
      reply.like_count++
    } else {
      reply.like_count--
    }
    console.error('回复点赞失败:', error)
  }
}
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 文章头部 */
.article-header {
  margin-bottom: 3rem;
  text-align: center;
}

.category-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0 0 1.5rem 0;
}

.meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.author,
.views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.tag:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* AI 摘要卡片 - 极其显眼的极客 UI */
.ai-summary-card {
  position: relative;
  margin: 3rem auto;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 16px;
  border: 2px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
  max-width: 800px;
}

.ai-summary-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 2px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  animation: border-glow 3s ease-in-out infinite;
}

@keyframes border-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ai-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  color: white;
}

.ai-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  opacity: 0.3;
  filter: blur(8px);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.ai-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-label {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.ai-content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0;
  padding-left: 4rem;
  max-width: 600px;
}

/* 文章正文 */
.article-content {
  margin: 3rem auto;
  max-width: 800px;
}

/* 文章底部 */
.article-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.metrics {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 24px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.action-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.action-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .meta {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ai-content {
    padding-left: 0;
  }

  .metrics {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .actions {
    flex-wrap: wrap;
  }
}

/* 评论区样式 */
.comments-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid var(--border-color);
}

/* 评论输入区 */
.comment-input-wrapper {
  margin-bottom: 2rem;
}

.input-header {
  display: flex;
  gap: 1rem;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.input-container {
  flex: 1;
}

.comment-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
}

.comment-textarea.focused {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  outline: none;
}

.comment-textarea:focus {
  outline: none;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.toolbar-left {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.submit-btn {
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 预览 */
.preview-wrapper {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px dashed var(--border-color);
}

.preview-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 评论头部 */
.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.comments-count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.sort-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;
}

.sort-btn:hover {
  color: var(--primary-color);
}

.sort-btn.active {
  color: var(--primary-color);
  font-weight: 600;
}

.sort-divider {
  color: var(--border-color);
}

/* 折叠内容区域 */
.comments-content {
  margin-top: 1.5rem;
}

/* 评论列表头部 */
.comments-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.collapse-btn svg {
  transition: transform 0.2s;
}

.collapse-btn svg.rotated {
  transform: rotate(180deg);
}

/* @某某蓝色样式 */
.comment-body :deep(.mention),
.reply-body :deep(.mention) {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
}

.comment-body :deep(.mention:hover),
.reply-body :deep(.mention:hover) {
  text-decoration: underline;
}

/* 删除按钮样式 */
.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  color: #dc2626;
}

/* 加载更多样式 */
.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.load-more-btn {
  padding: 0.75rem 2rem;
  background: transparent;
  border: 2px solid var(--primary-color);
  border-radius: 24px;
  color: var(--primary-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.comment-item {
  display: flex;
  flex-direction: column;
}

.comment-main {
  display: flex;
  gap: 1rem;
}

.comment-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content-wrapper {
  flex: 1;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.author-badge {
  padding: 0.125rem 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
}

.comment-time {
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.comment-body {
  color: var(--text-primary);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.comment-body :deep(.markdown-body) {
  font-size: 0.9375rem;
}

.comment-body :deep(.markdown-body pre) {
  margin: 0.75rem 0;
  font-size: 0.875rem;
}

.comment-body :deep(.markdown-body p) {
  margin: 0.5rem 0;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: all 0.2s;
}

.action-link:hover {
  color: var(--primary-color);
}

/* 回复输入框 */
.reply-input-wrapper {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  margin-left: 3.5rem;
}

.reply-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reply-input-container {
  flex: 1;
}

.reply-quote {
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border-left: 3px solid var(--primary-color);
  border-radius: 0 8px 8px 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.reply-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
}

.reply-textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.submit-reply-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-reply-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-reply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 回复列表 */
.replies-wrapper {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  margin-left: 3.5rem;
}

.thread-line {
  width: 2px;
  background: var(--border-color);
  margin-left: 21px;
  flex-shrink: 0;
}

.replies-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reply-item {
  display: flex;
  gap: 0.75rem;
}

.reply-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reply-content-wrapper {
  flex: 1;
}

.reply-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.reply-author {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.reply-time {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.reply-body {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.reply-body :deep(.markdown-body) {
  font-size: 0.875rem;
}

.reply-body :deep(.markdown-body pre) {
  margin: 0.5rem 0;
  font-size: 0.8125rem;
}

.reply-body :deep(.markdown-body p) {
  margin: 0.375rem 0;
}

.reply-actions-bottom {
  display: flex;
  gap: 0.75rem;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .ai-summary-card {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  }
}

/* 相关文章推荐样式 */
.related-articles-section {
  margin-top: 3rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.related-articles-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  svg {
    color: var(--primary-color);
  }
}

.related-articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-article-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s;
}

.related-article-item:hover {
  border-color: var(--primary-color);
  background: var(--bg-tertiary);
  transform: translateX(4px);
}

.related-article-content {
  flex: 1;
  min-width: 0;
}

.related-article-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.related-article-author {
  font-weight: 500;
}

.related-article-time {
  flex-shrink: 0;
}

.related-article-views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.related-article-views svg {
  opacity: 0.7;
}

.related-article-arrow {
  flex-shrink: 0;
  margin-left: 0.75rem;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.related-article-item:hover .related-article-arrow {
  color: var(--primary-color);
  transform: translateX(4px);
}

/* 响应式 */
@media (max-width: 1200px) {
  .floating-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .meta {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ai-content {
    padding-left: 0;
  }

  .metrics {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .actions {
    flex-wrap: wrap;
  }

  .comments-section {
    margin-top: 2.5rem;
    padding-top: 2rem;
  }

  .input-header {
    flex-direction: column;
  }

  .user-avatar {
    display: none;
  }

  .comment-main {
    gap: 0.75rem;
  }

  .comment-avatar {
    width: 36px;
    height: 36px;
  }

  .reply-input-wrapper,
  .replies-wrapper {
    margin-left: 2.75rem;
  }

  .toolbar {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .toolbar-left {
    justify-content: flex-start;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
