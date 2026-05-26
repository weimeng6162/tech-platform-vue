# 后端 API 联调说明文档

## 一、基础信息

### 1.1 API 基础路径配置
```typescript
// 建议在 .env 文件中配置
VITE_API_BASE_URL=http://your-backend-server:port/api/v1

// 开发环境示例
VITE_API_BASE_URL=http://localhost:8080/api/v1

// 生产环境示例
VITE_API_BASE_URL=https://api.techplatform.com/v1
```

### 1.2 统一响应格式
所有 API 均采用统一的响应结构：

```typescript
interface ApiResponse<T> {
  code: number       // 状态码：200=成功，其他=失败
  msg: string        // 响应消息
  data: T           // 业务数据
}
```

**状态码规范：**
- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权，需要登录
- `403`: 无权限访问
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 二、核心 API 接口定义

### 2.1 文章推荐列表接口

**接口说明：** 获取 AI 推荐的文章列表

**请求信息：**
```
GET /articles/recommend
```

**Query 参数：**
```typescript
{
  user_id?: string      // 用户ID（可选，用于个性化推荐）
  page?: number         // 页码，默认 1
  page_size?: number    // 每页数量，默认 20
  category?: string     // 分类筛选（可选）
}
```

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    article_list: [
      {
        article_id: string        // 文章唯一标识
        title: string             // 文章标题
        author: string            // 作者名称
        publish_time: string      // 发布时间（ISO 8601格式）
        category: string          // 文章分类
        ai_summary: string        // AI 生成的精华摘要（50-100字）
        tags: string[]            // 标签数组
        difficulty: '初级' | '中级' | '深度'  // 难度等级
        view_count: number        // 阅读数
        is_collected: boolean     // 当前用户是否已收藏
      }
    ],
    total: number,              // 总数
    has_more: boolean           // 是否有更多
  }
}
```

**示例请求：**
```javascript
// GET /articles/recommend?user_id=user123&page=1&page_size=20

// 响应示例
{
  "code": 200,
  "msg": "success",
  "data": {
    "article_list": [
      {
        "article_id": "wx_9527",
        "title": "深入理解 Transformer 架构的核心原理",
        "author": "张三",
        "publish_time": "2024-01-15T10:30:00Z",
        "category": "人工智能",
        "ai_summary": "本文详细解析 Transformer 的自注意力机制、编码器-解码器结构及位置编码原理",
        "tags": ["深度学习", "Transformer", "NLP"],
        "difficulty": "深度",
        "view_count": 12580,
        "is_collected": false
      }
    ],
    "total": 100,
    "has_more": true
  }
}
```

---

### 2.2 文章详情接口

**接口说明：** 获取文章完整内容

**请求信息：**
```
GET /articles/:article_id
```

**路径参数：**
- `article_id`: 文章ID

**Query 参数：**
```typescript
{
  user_id?: string    // 用户ID（可选，用于获取交互状态）
}
```

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    article_id: string
    title: string
    author: string
    publish_time: string
    category: string
    ai_summary: string        // AI 摘要
    tags: string[]
    content: string           // Markdown 格式的正文内容
    metrics: {
      view_count: number      // 阅读数
      like_count: number      // 点赞数
      collect_count: number   // 收藏数
    }
    interaction_status: {
      is_liked: boolean       // 是否已点赞
      is_collected: boolean   // 是否已收藏
    }
    original_url: string      // 原文链接（已删除按钮，但数据仍保留）
  }
}
```

**示例请求：**
```javascript
// GET /articles/wx_9527?user_id=user123

// 响应示例
{
  "code": 200,
  "msg": "success",
  "data": {
    "article_id": "wx_9527",
    "title": "深入理解 Transformer 架构的核心原理",
    "author": "张三",
    "publish_time": "2024-01-15T10:30:00Z",
    "category": "人工智能",
    "ai_summary": "本文详细解析 Transformer 的自注意力机制...",
    "tags": ["深度学习", "Transformer", "NLP"],
    "content": "# Transformer 架构详解\n\n## 1. 什么是 Transformer\n\n...",
    "metrics": {
      "view_count": 12580,
      "like_count": 892,
      "collect_count": 456
    },
    "interaction_status": {
      "is_liked": false,
      "is_collected": true
    },
    "original_url": "https://mp.weixin.qq.com/s/xxxxxx"
  }
}
```

---

### 2.3 用户画像接口

**接口说明：** 获取用户画像及 AI 分析结果

**请求信息：**
```
GET /users/:user_id/profile
```

**路径参数：**
- `user_id`: 用户ID

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    user_id: string
    nickname: string
    avatar_url: string
    ai_analysis: {
      ai_profile_summary: string      // AI 生成的专属评语
      technical_level: string          // 技术水平评估
      core_interests: [                // 核心兴趣领域
        {
          name: string                 // 兴趣名称
          weight: number               // 权重 0-100
        }
      ]
    }
  }
}
```

**示例请求：**
```javascript
// GET /users/user123/profile

// 响应示例
{
  "code": 200,
  "msg": "success",
  "data": {
    "user_id": "user123",
    "nickname": "技术达人",
    "avatar_url": "https://cdn.example.com/avatar.jpg",
    "ai_analysis": {
      "ai_profile_summary": "你是一位专注于前端开发和 AI 应用交叉领域的全栈工程师，对新技术保持高度敏感",
      "technical_level": "高级",
      "core_interests": [
        { "name": "Vue", "weight": 85 },
        { "name": "React", "weight": 75 },
        { "name": "深度学习", "weight": 60 },
        { "name": "TypeScript", "weight": 90 }
      ]
    }
  }
}
```

---

### 2.4 用户收藏列表接口

**接口说明：** 获取用户收藏的文章列表

**请求信息：**
```
GET /users/:user_id/collections
```

**路径参数：**
- `user_id`: 用户ID

**Query 参数：**
```typescript
{
  page?: number         // 页码，默认 1
  page_size?: number    // 每页数量，默认 20
}
```

**响应数据：** 同文章推荐列表格式

---

### 2.5 用户足迹列表接口

**接口说明：** 获取用户浏览历史

**请求信息：**
```
GET /users/:user_id/history
```

**路径参数：**
- `user_id`: 用户ID

**Query 参数：**
```typescript
{
  page?: number         // 页码，默认 1
  page_size?: number    // 每页数量，默认 20
}
```

**响应数据：** 同文章推荐列表格式

---

### 2.6 兴趣配置接口

**接口说明：** 设置用户兴趣标签

**请求信息：**
```
POST /users/:user_id/interests
```

**路径参数：**
- `user_id`: 用户ID

**请求体：**
```typescript
{
  interests: string[]    // 兴趣标签ID数组
}
```

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    success: true
  }
}
```

**示例请求：**
```javascript
// POST /users/user123/interests
{
  "interests": ["vue", "react", "typescript", "深度学习", "llm"]
}

// 响应示例
{
  "code": 200,
  "msg": "兴趣配置成功",
  "data": {
    "success": true
  }
}
```

---

### 2.7 文章交互接口

#### 2.7.1 点赞/取消点赞

**请求信息：**
```
POST /articles/:article_id/like
DELETE /articles/:article_id/like
```

**请求体（POST）：**
```typescript
{
  user_id: string
}
```

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    is_liked: boolean,      // 当前状态
    like_count: number      // 更新后的点赞数
  }
}
```

#### 2.7.2 收藏/取消收藏

**请求信息：**
```
POST /articles/:article_id/collect
DELETE /articles/:article_id/collect
```

**请求体（POST）：**
```typescript
{
  user_id: string
}
```

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    is_collected: boolean,    // 当前状态
    collect_count: number     // 更新后的收藏数
  }
}
```

---

## 三、文章标签规范

### 3.1 标签分类

前端使用统一的标签库，后端返回的 `tags` 字段应为标签ID数组：

```typescript
// 标签格式示例
{
  tags: ["vue", "typescript", "深度学习"]  // 使用标签ID
}
```

### 3.2 特殊标签说明

系统保留以下特殊标签用于内容审核：

```typescript
// 劣质文章标签（需过滤，不应展示给用户）
const BLOCKED_TAGS = ['安全拦截', '提示词注入', '营销软文', '技术水文']

// 警示标签（需显示警告但仍展示）
const WARNING_TAG = '含商业推广'
```

**后端处理建议：**
- 劣质文章标签的文章不建议返回给前端
- 如果返回，前端会自动过滤（见 `src/utils/articleFilter.ts`）

---

## 四、认证与鉴权

### 4.1 认证方式

推荐使用 **JWT Token** 认证：

```typescript
// 请求头格式
Authorization: Bearer <token>
```

### 4.2 登录接口

**请求信息：**
```
POST /auth/login
```

**请求体：**
```typescript
{
  username: string
  password: string
}
```

**响应数据：**
```typescript
{
  code: 200,
  msg: "success",
  data: {
    token: string           // JWT token
    user_id: string
    nickname: string
    avatar_url: string
    expires_in: number      // token有效期（秒）
  }
}
```

---

## 五、前端对接说明

### 5.1 API 调用封装

建议在 `src/api/` 目录下创建服务层：

```typescript
// src/api/articles.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器 - 添加 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // 跳转登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 获取推荐文章列表
export const getRecommendArticles = (params) => {
  return api.get('/articles/recommend', { params })
}

// 获取文章详情
export const getArticleDetail = (articleId, userId) => {
  return api.get(`/articles/${articleId}`, { params: { user_id: userId } })
}
```

### 5.2 数据类型导入

前端已定义完整的类型，可直接导入使用：

```typescript
import type { 
  ApiResponse, 
  ArticleItem, 
  ArticleDetailData,
  UserProfileData 
} from '@/types/api'
```

### 5.3 Mock 数据说明

当前项目使用 Mock 数据开发，文件位置：
- `src/data/mockData.ts` - 模拟数据定义

**切换真实 API：**
1. 创建 `.env.local` 配置 API 地址
2. 在组件中替换 mockData 导入为 API 调用
3. 删除或注释 mockData 相关代码

---

## 六、错误处理

### 6.1 错误响应格式

```typescript
{
  code: 400,
  msg: "参数错误：article_id 不能为空",
  data: null
}
```

### 6.2 前端错误处理示例

```typescript
try {
  const response = await getArticleDetail(articleId)
  if (response.code === 200) {
    // 处理成功逻辑
    article.value = response.data
  } else {
    // 业务错误
    ElMessage.error(response.msg)
  }
} catch (error) {
  // 网络错误或系统错误
  ElMessage.error('网络请求失败，请稍后重试')
}
```

---

## 七、性能优化建议

### 7.1 分页加载

```typescript
// 使用 page 和 page_size 参数进行分页
{
  page: 1,
  page_size: 20
}
```

### 7.2 缓存策略

建议后端为以下接口添加缓存：
- 文章详情（缓存 10 分钟）
- 用户画像（缓存 5 分钟）
- 推荐列表（缓存 1 分钟，个性化）

### 7.3 响应压缩

建议启用 Gzip 压缩，特别是文章内容字段。

---

## 八、联调检查清单

### 8.1 必查项

- [ ] API 基础路径配置正确
- [ ] 响应格式符合 `ApiResponse<T>` 结构
- [ ] 时间格式统一使用 ISO 8601（`2024-01-15T10:30:00Z`）
- [ ] 标签使用标签ID，非标签名称
- [ ] 认证 token 正确传递
- [ ] 跨域配置正确（CORS）

### 8.2 推荐检查项

- [ ] 分页参数默认值一致
- [ ] 错误码规范统一
- [ ] 响应时间 < 500ms
- [ ] 错误信息友好可读
- [ ] 图片 URL 可访问
- [ ] Markdown 内容格式正确

---

## 九、联系方式

如有接口对接问题，请提供：
1. 接口名称
2. 请求参数
3. 响应内容
4. 错误信息

---

**最后更新时间：** 2024-01-15  
**前端负责人：** TechFlow Team  
**文档版本：** v1.0
