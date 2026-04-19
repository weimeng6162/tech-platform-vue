# TechFlow - 技术文章聚合平台

一个基于 Vue 3 + TypeScript + Vite 构建的现代化技术文章聚合平台，集成 AI 推荐系统，提供智能化的内容推荐和过滤功能。

## ✨ 功能特性

### 🤖 AI 推荐系统
- **智能推荐**：基于用户兴趣推荐相关技术文章
- **内容过滤**：自动识别并过滤劣质文章（营销软文、技术水文、安全拦截等）
- **商业推广警示**：检测到商业推广内容时显示醒目的警示标识

### 📝 文章功能
- **Markdown 渲染**：支持完整的 Markdown 语法渲染
- **代码高亮**：支持多种编程语言的代码高亮（Go、Python、Java、TypeScript 等）
- **AI 摘要**：每篇文章都有 AI 生成的精华摘要
- **难度标识**：初级🌱、中级⚡、深度🚀

### 🔍 搜索功能
- **多维度搜索**：支持搜索标题、摘要、作者、标签、分类
- **关键词高亮**：搜索结果中关键词高亮显示
- **搜索历史**：保存最近搜索记录

### 👣 足迹功能
- **阅读历史**：自动记录浏览过的文章
- **快速访问**：一键回到最近阅读的文章
- **历史管理**：支持清空阅读记录

### ⭐ 收藏功能
- **文章收藏**：收藏喜欢的文章
- **收藏管理**：在收藏页面查看和管理收藏
- **持久化存储**：使用 localStorage 保存数据

### 🎨 用户体验
- **页面切换动画**：流畅自然的页面过渡效果
- **响应式设计**：完美适配桌面端和移动端
- **暗色主题**：支持明暗主题切换
- **用户画像**：展示用户的技术画像和兴趣分析

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📦 技术栈

- **前端框架**：Vue 3 (Composition API)
- **开发语言**：TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router
- **状态管理**：Pinia
- **UI 组件**：Lucide Vue Next (图标)
- **Markdown 渲染**：marked
- **代码高亮**：highlight.js
- **样式预处理**：Sass

## 📁 项目结构

```
tech-platform-vue/
├── src/
│   ├── components/          # 组件
│   │   ├── ArticleCardAI.vue       # AI 文章卡片
│   │   ├── MarkdownRenderer.vue    # Markdown 渲染器
│   │   ├── SearchModal.vue         # 搜索弹窗
│   │   ├── SecurityWarning.vue     # 安全警示
│   │   └── UserProfileAI.vue       # 用户画像
│   ├── composables/         # 组合式函数
│   │   └── usePageTransition.ts    # 页面切换动画
│   ├── data/                # 数据
│   │   └── mockData.ts             # 模拟数据
│   ├── layouts/             # 布局
│   │   └── MainLayout.vue          # 主布局
│   ├── router/              # 路由
│   │   └── index.ts                # 路由配置
│   ├── stores/              # 状态管理
│   │   ├── collectedArticles.ts    # 收藏状态
│   │   ├── recentArticles.ts       # 阅读历史
│   │   └── theme.ts                # 主题状态
│   ├── types/               # 类型定义
│   │   └── api.ts                  # API 类型
│   ├── utils/               # 工具函数
│   │   └── articleFilter.ts        # 文章过滤
│   └── views/               # 页面
│       ├── Home.vue                # 首页
│       ├── ArticleDetailAI.vue     # 文章详情
│       ├── Footprint.vue           # 足迹页面
│       ├── Collection.vue          # 收藏页面
│       └── InterestSetup.vue       # 兴趣配置
├── public/                  # 静态资源
├── vite.config.ts          # Vite 配置
└── package.json            # 项目配置
```

## 🎯 核心功能说明

### AI 内容安全识别

系统会自动识别以下类型的劣质文章并过滤：
- 🚫 **安全拦截**：包含恶意代码或攻击内容
- 🚫 **提示词注入**：尝试注入恶意提示词
- 🚫 **营销软文**：纯营销推广内容
- 🚫 **技术水文**：内容空洞无价值

对于包含技术干货但文末有商业推广的文章，系统会：
- ✅ 保留文章内容
- ⚠️ 显示橘红色警示标识
- 💡 提示用户文末有商业信息

### 文章过滤流程

```
原始文章列表
    ↓
AI 内容识别
    ↓
过滤劣质文章
    ↓
标记商业推广
    ↓
展示给用户
```

## 🌐 部署说明

### GitHub Pages 部署

1. 构建项目
```bash
npm run build
```

2. 部署到 GitHub Pages
   - 进入仓库 Settings → Pages
   - 选择 Source: Deploy from a branch
   - 选择 Branch: main, Folder: / (root)
   - 等待部署完成

3. 访问地址
```
https://[username].github.io/tech-platform-vue/
```

### 本地开发

项目配置了正确的 base 路径，支持本地开发和生产部署：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/tech-platform-vue/',
  // ...
})
```

## 📊 数据存储

使用 localStorage 进行数据持久化：

- `recent-articles` - 最近阅读的文章列表
- `collected-articles` - 收藏的文章列表
- `recent-searches` - 最近搜索记录

## 🎨 主题支持

支持明暗两种主题：
- ☀️ 浅色主题：清新明亮
- 🌙 暗色主题：护眼舒适

主题状态会自动保存到 localStorage。

## 📱 响应式设计

完美适配各种设备：
- 💻 桌面端：完整功能展示
- 📱 平板端：自适应布局
- 📱 移动端：优化的移动体验

## 🔧 配置说明

### 路由配置

使用 `createWebHistory` 模式，支持 GitHub Pages 部署：

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
```

### API 类型定义

完整的 TypeScript 类型定义，提供类型安全：

```typescript
interface ArticleItem {
  article_id: string
  title: string
  author: string
  ai_summary: string
  tags: string[]
  difficulty: '初级' | '中级' | '深度'
  // ...
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

weimeng6162

---

**TechFlow** - 让技术学习更高效 🚀
