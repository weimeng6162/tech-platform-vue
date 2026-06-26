<!--
  ============================================================
  CLAUDE.example.md — 团队示例配置

  这是 Claude Code 的示例配置文件，提交到 Git 供团队参考。
  如需使用，请复制为 CLAUDE.local.md 并根据自己的开发习惯修改。

  CLAUDE.local.md 已加入 .gitignore（*.local 规则），
  不会被 Git 跟踪，不会影响团队协作。

  示例：
    cp CLAUDE.example.md CLAUDE.local.md
  ============================================================
-->

# tech-platform-vue

## 技术栈

Vue 3.5 + TypeScript 6 + Vite 8 + Pinia 3 + Vue Router 4
UI：CSS 变量主题系统 + lucide-vue-next 图标 + echarts
HTTP：axios 1.x（拦截器自动解包 `{code, data}` → `data`，自动附加 token）
加密：crypto-js AES-CBC + Web Crypto API SHA-256
Markdown：marked + highlight.js（懒加载，912KB）
工具：@vueuse/core

## 编码规范

- `<script setup lang="ts">` only，禁止 Options API
- `noUnusedLocals: true`，`noUnusedParameters: true`，禁止 `any`
- Vue 组件 PascalCase，TS 模块 camelCase，样式 kebab-case
- 路径别名 `@/` → `src/`
- 不写注释，除非 WHY 不明显。代码通过命名自解释
- localStorage 轻量状态用 module-scoped `ref()`（见 `src/stores/recentArticles.ts`），不要全上 Pinia
- **类型定义以 `src/api/types.ts` 为准**，不要碰 `src/types/api.ts` 和 `src/types/api.d.ts`

## 反模式禁令

1. **禁止无意义 try-catch**：拦截器已统一处理错误，组件里不要包裹 try-catch。只有乐观更新回滚才需要 catch
2. **禁止 Props 全列 optional**：Props 默认 required，仅真正可选的才加 `?`
3. **禁止不读代码就新建文件**：加功能前先搜有没有现成的 composable / component / util
4. **禁止单体组件**：单组件超过 300 行必须拆分，提取 composable 或子组件
5. **禁止硬编码样式值**：颜色、间距、圆角、阴影一律用 CSS 变量，不要写 `#fff`、`16px` 这种裸值
6. **禁止不必要的 loading 状态**：Suspense + async setup 即可，不要每个请求手动维护 `isLoading` ref

## 设计规范

- **颜色**：用 `var(--color-*)` 系列，明暗主题自动切换。`--color-bg-primary` / `--color-text-primary` / `--color-accent` / `--color-border`
- **间距**：用 `var(--spacing-*)`，4px 基准：`--spacing-xs`(4) / `--spacing-sm`(8) / `--spacing-md`(16) / `--spacing-lg`(24) / `--spacing-xl`(32)
- **圆角**：`var(--radius-sm)`(6px) / `var(--radius-md)`(12px) / `var(--radius-lg)`(20px)
- **动画**：用 `useScrollAnimation` composable 或 `<ScrollReveal>` 组件，不要手写 IntersectionObserver
- **按钮**：用 `<AnimatedButton>` 组件，支持 primary / secondary / ghost / danger 四种 variant
- **空状态**：列表/搜索结果为空时必须有空状态提示，用 `<div class="empty-state">` + lucide 图标
- **响应式**：`@media (max-width: 768px)` 断点，移动端单栏布局

## 项目结构速查

```
src/api/ (config + request + modules/) | src/components/ (28个通用组件) | src/composables/ (useNotification/useRipple/useScrollAnimation/useRefresh/usePageTransition) | src/layouts/ (MainLayout) | src/router/ (路由 + highlight.js 预加载守卫) | src/stores/ (user/theme 用 Pinia，其余 module-ref) | src/styles/ (variables.css + global.scss) | src/utils/ (aes/crypto/formatTime/markdown/articleFilter) | src/views/ (13个页面)
```

## 路由 & 权限

| 路由 | 视图 | 需认证 |
|------|------|--------|
| `/login` `/register` | Login / Register | 否 |
| `/interest` | InterestSetup（冷启动3步向导） | 是 |
| `/` | Home（推荐流） | 否 |
| `/article/:id` | ArticleDetailAI | 否 |
| `/category` | Category | 否 |
| `/footprint` `/collection` | Footprint / Collection | 是 |
| `/user/profile` `/settings` | UserProfile / Settings | 是 |

路由守卫：需认证页面未登录 → `/login`；新用户未选兴趣 → `/interest`（宽限期1天免 token）

## API

- 后端：`http://8.156.93.58:8080`，Mock 兜底 `http://localhost:3000`
- `src/api/config.ts` 的 `USE_REAL_BACKEND_FOR_AUTH` 控制开关
- 请求拦截器自动：加 `Authorization: Bearer <token>` + 解包响应 + 401 清 token 跳 `/login`
- `_silent` 标记的请求失败不弹错误，静默 fallback Mock
- 主要接口：`/api/user/*`（认证/资料/冷启动）、`/api/articles/*`（推荐/详情/评论）、`/api/comments/*`（创建/操作）

## Token 消耗规则

- **优先 Edit 而非 Write**：修改现有文件用 Edit 工具，只有新建文件才用 Write
- **读文件指定 limit**：已知要改的位置直接 `Read(offset, limit=30)`，不要无限制读全部
- **不要读完 mock.ts**：Mock 数据文件很长（`src/api/mock.ts`、`src/data/mockData.ts`），只读需要的片段
- **善用 Grep**：找函数/变量定义先用 Grep 定位，再 Read 局部，不要逐文件通读
