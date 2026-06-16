# tech-platform-vue

## 技术栈

Vue 3.5 + TypeScript 6 + Vite 8 + Pinia 3 + Vue Router 4
UI：自定义 CSS 变量主题系统 + lucide-vue-next 图标 + echarts 图表
HTTP：axios 1.x，动态 baseURL 路由（拦截器决定走真实后端还是 mock）
加密：crypto-js (AES-CBC) + Web Crypto API (SHA-256)
Markdown：marked + highlight.js（代码高亮懒加载）
工具库：@vueuse/core

## 编码规范

- **Composition API only**：所有组件用 `<script setup lang="ts">`，禁止 Options API
- **严格类型**：`noUnusedLocals: true`，`noUnusedParameters: true`，禁止 `any`（除非有充分理由）
- **文件命名**：Vue 组件 PascalCase，TS 模块 camelCase，样式 kebab-case
- **路径别名**：`@/` 映射 `src/`
- **不写注释**：除非 WHY 不明显。代码通过命名自解释
- **模块级状态**：localStorage 持久化的轻量状态用 module-scoped `ref()` 模式（参考 `src/stores/`），不需要全上 Pinia

## 项目结构

```
src/
  api/          config.ts（动态路由开关）+ request.ts（axios实例+拦截器）+ modules/（业务API）
  components/   通用组件（全部自建，无第三方 UI 库）
  composables/  useNotification, usePageTransition, useRefresh 等
  layouts/      MainLayout（Header + ProgressBar + RouterView）
  router/       路由定义 + highlight.js 预加载守卫
  stores/       user（Pinia 认证）, theme（Pinia 主题），其余轻量状态用 module-ref 模式
  styles/       global.scss（主样式）+ variables.css（CSS 自定义属性 + 明暗主题）
  utils/        aes, crypto, formatTime, markdown, articleFilter
  views/        页面组件
```

## 常用命令

```bash
npm run dev         # 启动开发服务器，端口 5173
npm run build       # 构建（先 vue-tsc 类型检查再 vite build）
npm run preview     # 预览生产构建
```

## API 配置

- **Vite 代理**：`/api` 和 `/api/articles` → `http://8.156.93.58:8080`
- **动态后端切换**：`src/api/config.ts` 的 `USE_REAL_BACKEND_FOR_AUTH` 全局开关
  - `true` → `http://8.156.93.58:8080`（真实后端）
  - `false` → `http://localhost:3000`（本地 express mock 服务器）
- **Token 管理**：存在 localStorage，请求拦截器自动附加 `Authorization: Bearer <token>`
- **新用户宽限期**：注册后 1 天内无需 token（`NEW_USER_GRACE_DAYS = 1`）
- **响应解包**：拦截器自动将 `{ code: 200, data: {...} }` 解包为 `data`，调用方直接拿业务类型
- **401 处理**：自动清 token 并跳转 `/login`

## 关键约束

- **部署路径**：`/tech-platform-vue/`（vite base path，所有资源路径需加此前缀）
- **TypeScript 项目引用**：`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`，编辑器需确认引用了正确的 tsconfig
- **Sass 1.99**：`silenceDeprecations: ['import']`，不要用 `@import` 语法
- **安全过滤**：文章列表会过滤 `safety intercept`、`prompt injection` 等标签（`utils/articleFilter.ts`）
- **存储键名**：token、theme、注册时间等都用 localStorage，键名前缀不统一，新增键注意不要冲突
- **类型定义**：存在多处重复（`src/api/types.ts` / `src/types/api.ts` / `src/types/api.d.ts`），以 `src/api/types.ts` 为准
