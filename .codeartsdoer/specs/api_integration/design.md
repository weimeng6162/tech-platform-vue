# **1. 实现模型**

## **1.1 上下文视图**

本设计文档描述前端API集成层的技术实现方案，基于Vue 3 + TypeScript + Axios技术栈，实现前端应用与后端API的数据交互。

**技术选型**：
- **HTTP客户端**：Axios（业界标准，功能完善，拦截器机制强大）
- **状态管理**：Pinia（已集成，用于缓存API数据）
- **类型系统**：TypeScript（提供类型安全）
- **Markdown渲染**：marked.js + highlight.js（支持代码高亮）

## **1.2 服务/组件总体架构**

```
src/
├── api/                    # API层（新增）
│   ├── config.ts          # API配置（baseURL、timeout等）
│   ├── request.ts         # Axios实例封装（拦截器）
│   ├── types.ts           # API响应类型定义
│   └── modules/           # API模块
│       ├── article.ts     # 文章相关API
│       └── user.ts        # 用户相关API
├── utils/                 # 工具函数（新增）
│   └── markdown.ts        # Markdown渲染工具
├── components/            # 组件层（修改）
│   ├── ArticleCard.vue    # 文章卡片（接入真实数据）
│   └── AISummary.vue      # AI摘要组件（新增）
└── views/                 # 页面层（修改）
    ├── Home.vue           # 首页（接入推荐文章API）
    └── ArticleDetail.vue  # 文章详情（接入详情API）
```

**架构分层**：
1. **API层**：封装所有HTTP请求，提供类型安全的API调用方法
2. **工具层**：提供Markdown渲染等通用功能
3. **组件层**：负责UI渲染，调用API层获取数据
4. **页面层**：组合组件，管理页面级数据流

## **1.3 实现设计文档**

### **1.3.1 Axios实例封装**

**文件**：`src/api/request.ts`

**设计要点**：
1. 创建Axios实例，配置baseURL和timeout
2. **请求拦截器**：
   - 自动添加Content-Type头
   - 从localStorage读取token并添加到Authorization头
   - 记录请求日志
3. **响应拦截器**：
   - 统一处理响应数据，提取data字段
   - 根据code判断业务错误
   - 处理401认证失败（清除token，跳转登录）
   - 处理网络错误和超时错误
   - 记录响应日志

**错误处理策略**：
- 网络错误：显示"网络连接失败"
- 401错误：清除token，跳转登录页
- 404错误：显示"请求资源不存在"
- 500错误：显示"服务器内部错误"
- 超时错误：显示"请求超时"
- 其他错误：显示"系统异常"

### **1.3.2 API模块设计**

**文章API模块**：`src/api/modules/article.ts`

提供方法：
- `getRecommendArticles()`：获取推荐文章列表
- `getArticleDetail(articleId: string)`：获取文章详情

**用户API模块**：`src/api/modules/user.ts`

提供方法：
- `getUserProfile()`：获取用户侧写信息

### **1.3.3 TypeScript类型定义**

**文件**：`src/api/types.ts`

定义所有API响应的TypeScript接口，确保类型安全：
- `ApiResponse<T>`：通用响应包装
- `ArticleListItem`：文章列表项
- `ArticleDetail`：文章详情
- `UserProfile`：用户侧写
- `AIAnalysis`：AI分析结果

### **1.3.4 Markdown渲染工具**

**文件**：`src/utils/markdown.ts`

**设计要点**：
1. 使用marked.js解析Markdown
2. 使用highlight.js实现代码高亮
3. 配置支持的语言：Go、Python、Java、JavaScript、TypeScript、Vue等
4. 提供渲染函数：`renderMarkdown(content: string): string`

### **1.3.5 AI摘要组件设计**

**文件**：`src/components/AISummary.vue`

**设计要点**：
1. 接收`summary`属性（AI摘要文本）
2. 使用特殊样式：渐变背景、AI闪光图标、圆角卡片
3. 添加"AI生成"标识
4. 响应式设计，适配不同屏幕尺寸

### **1.3.6 文章卡片组件改造**

**文件**：`src/components/ArticleCard.vue`

**改造要点**：
1. 接收完整的文章数据对象（ArticleListItem类型）
2. 渲染AI摘要（使用AISummary组件）
3. 渲染技术标签（使用不同颜色的Tag）
4. 渲染难度角标（根据difficulty字段显示不同颜色）
5. 显示浏览次数和收藏状态
6. 点击跳转到文章详情页

**难度颜色映射**：
- 初级：绿色
- 中级：蓝色
- 深度：紫色

### **1.3.7 首页改造**

**文件**：`src/views/Home.vue`

**改造要点**：
1. 使用Vue 3 Composition API
2. 在`onMounted`生命周期调用`getRecommendArticles()`API
3. 管理加载状态（loading）
4. 管理错误状态（error）
5. 将API返回的文章列表传递给ArticleCard组件渲染
6. 空状态处理：无数据时显示"暂无推荐文章"

### **1.3.8 文章详情页改造**

**文件**：`src/views/ArticleDetail.vue`

**改造要点**：
1. 从路由参数获取`articleId`
2. 调用`getArticleDetail(articleId)`API获取详情
3. 使用AISummary组件展示AI摘要
4. 使用Markdown渲染工具渲染文章正文
5. 显示文章指标（浏览、点赞、收藏次数）
6. 渲染交互按钮（点赞、收藏），根据`interaction_status`设置初始状态
7. 文末添加"阅读原文"按钮，链接到`original_url`

# **2. 接口设计**

## **2.1 总体设计**

所有API接口遵循RESTful风格，返回统一的JSON格式：

```typescript
interface ApiResponse<T> {
  code: number;      // 200成功，其他为错误码
  msg: string;       // 响应消息
  data: T;           // 业务数据
}
```

## **2.2 接口清单**

### **2.2.1 获取推荐文章列表**

**接口**：`GET /api/articles/recommend`

**请求参数**：无

**响应类型**：
```typescript
interface RecommendArticlesResponse {
  code: number;
  msg: string;
  data: {
    article_list: ArticleListItem[];
  };
}
```

**前端调用方法**：
```typescript
// src/api/modules/article.ts
export function getRecommendArticles(): Promise<ArticleListItem[]> {
  return request.get('/api/articles/recommend');
}
```

### **2.2.2 获取文章详情**

**接口**：`GET /api/articles/detail`

**请求参数**：
- `article_id`（query参数）：文章ID

**响应类型**：
```typescript
interface ArticleDetailResponse {
  code: number;
  msg: string;
  data: ArticleDetail;
}
```

**前端调用方法**：
```typescript
// src/api/modules/article.ts
export function getArticleDetail(articleId: string): Promise<ArticleDetail> {
  return request.get('/api/articles/detail', { params: { article_id: articleId } });
}
```

### **2.2.3 获取用户侧写**

**接口**：`GET /api/user/profile`

**请求参数**：无（token在请求头中）

**响应类型**：
```typescript
interface UserProfileResponse {
  code: number;
  msg: string;
  data: UserProfile;
}
```

**前端调用方法**：
```typescript
// src/api/modules/user.ts
export function getUserProfile(): Promise<UserProfile> {
  return request.get('/api/user/profile');
}
```

# **3. 数据模型**

## **3.1 设计目标**

1. 提供完整的TypeScript类型定义，确保类型安全
2. 与后端API响应结构完全对应
3. 便于前端组件直接使用，减少数据转换

## **3.2 模型实现**

### **3.2.1 文章列表项模型**

```typescript
// src/api/types.ts
export interface ArticleListItem {
  article_id: string;        // 文章ID
  title: string;             // 文章标题
  author: string;            // 作者
  publish_time: string;      // 发布时间（ISO 8601）
  category: string;          // 分类
  ai_summary: string;        // AI摘要
  tags: string[];            // 技术标签
  difficulty: '初级' | '中级' | '深度';  // 难度
  view_count: number;        // 浏览次数
  is_collected: boolean;     // 是否已收藏
}
```

### **3.2.2 文章详情模型**

```typescript
// src/api/types.ts
export interface ArticleDetail {
  article_id: string;
  title: string;
  author: string;
  publish_time: string;
  category: string;
  ai_summary: string;
  tags: string[];
  content: string;           // Markdown正文
  metrics: {
    view_count: number;
    like_count: number;
    collect_count: number;
  };
  interaction_status: {
    is_liked: boolean;
    is_collected: boolean;
  };
  original_url: string;      // 原文链接
}
```

### **3.2.3 用户侧写模型**

```typescript
// src/api/types.ts
export interface UserProfile {
  user_id: string;
  nickname: string;
  avatar_url: string;
  ai_analysis: AIAnalysis;
}

export interface AIAnalysis {
  ai_profile_summary: string;    // AI评语
  technical_level: string;       // 技术等级
  core_interests: CoreInterest[]; // 核心技术栈
}

export interface CoreInterest {
  name: string;    // 技术名称
  weight: number;  // 权重（0-100）
}
```

### **3.2.4 通用响应模型**

```typescript
// src/api/types.ts
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}
```

# **4. 环境配置**

## **4.1 API配置管理**

**文件**：`src/api/config.ts`

**设计要点**：
1. 支持多环境配置（开发、测试、生产）
2. 使用环境变量动态切换
3. 提供默认配置

**配置结构**：
```typescript
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

const config: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};
```

## **4.2 环境变量**

创建`.env.development`和`.env.production`文件：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.production.com
```

# **5. 依赖安装**

需要安装的新依赖：

```bash
# HTTP客户端
npm install axios

# Markdown渲染
npm install marked

# 代码高亮
npm install highlight.js
```

# **6. 实现步骤**

1. 安装依赖（axios、marked、highlight.js）
2. 创建API层目录结构
3. 实现API配置和Axios实例封装
4. 定义TypeScript类型
5. 实现API模块方法
6. 实现Markdown渲染工具
7. 创建AI摘要组件
8. 改造文章卡片组件
9. 改造首页，接入推荐文章API
10. 改造文章详情页，接入详情API
11. 测试所有API调用和页面展示
