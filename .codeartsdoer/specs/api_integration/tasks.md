# API集成开发任务清单

## 任务概述
根据后端提供的假数据，在前端实现API连接，将模拟数据替换为真实后端数据，实现首页推荐文章列表、文章详情页、用户侧写等功能。

---

## 任务列表

### 阶段一：环境准备与依赖安装

#### 任务1：安装必要的npm依赖
**描述**：安装axios、marked、highlight.js等依赖包
**文件**：`package.json`
**操作**：
```bash
npm install axios marked highlight.js
```
**验收标准**：依赖安装成功，package.json中包含新依赖

---

### 阶段二：API层基础架构搭建

#### 任务2：创建API配置文件
**描述**：创建API基础配置，包括baseURL、timeout等
**文件**：`src/api/config.ts`
**操作**：创建API配置文件，支持环境变量配置
**验收标准**：配置文件创建成功，可读取环境变量

#### 任务3：创建TypeScript类型定义
**描述**：定义所有API响应的TypeScript接口
**文件**：`src/api/types.ts`
**操作**：定义ApiResponse、ArticleListItem、ArticleDetail、UserProfile等接口
**验收标准**：类型定义完整，与后端假数据结构一致

#### 任务4：封装Axios实例和拦截器
**描述**：创建Axios实例，配置请求和响应拦截器
**文件**：`src/api/request.ts`
**操作**：
- 创建Axios实例
- 实现请求拦截器（添加token、设置请求头）
- 实现响应拦截器（统一错误处理、数据提取）
**验收标准**：拦截器正常工作，能自动添加token和处理错误

---

### 阶段三：API模块实现

#### 任务5：实现文章API模块
**描述**：封装文章相关的API调用方法
**文件**：`src/api/modules/article.ts`
**操作**：
- 实现`getRecommendArticles()`方法
- 实现`getArticleDetail(articleId)`方法
**验收标准**：方法可正常调用，返回正确的类型

#### 任务6：实现用户API模块
**描述**：封装用户相关的API调用方法
**文件**：`src/api/modules/user.ts`
**操作**：实现`getUserProfile()`方法
**验收标准**：方法可正常调用，返回正确的类型

---

### 阶段四：工具函数实现

#### 任务7：实现Markdown渲染工具
**描述**：创建Markdown渲染和代码高亮工具
**文件**：`src/utils/markdown.ts`
**操作**：
- 使用marked.js解析Markdown
- 使用highlight.js实现代码高亮
- 配置支持的语言（Go、Python、Java、JavaScript、TypeScript等）
**验收标准**：能正确渲染Markdown，代码块有语法高亮

---

### 阶段五：组件开发与改造

#### 任务8：创建AI摘要组件
**描述**：创建专门展示AI摘要的组件，带特殊样式
**文件**：`src/components/AISummary.vue`
**操作**：
- 创建Vue组件，接收summary属性
- 设计特殊UI样式（渐变背景、AI图标、圆角卡片）
- 添加"AI生成"标识
**验收标准**：组件渲染正常，样式符合极客风格

#### 任务9：改造文章卡片组件
**描述**：改造ArticleCard组件，接入真实数据结构
**文件**：`src/components/ArticleCard.vue`
**操作**：
- 修改props接收ArticleListItem类型数据
- 使用AISummary组件展示AI摘要
- 渲染技术标签（不同颜色）
- 渲染难度角标（根据difficulty显示不同颜色）
- 显示浏览次数和收藏状态
**验收标准**：卡片能正确展示所有字段，样式美观

---

### 阶段六：页面改造与API集成

#### 任务10：改造首页，接入推荐文章API
**描述**：在首页调用推荐文章API，展示真实数据
**文件**：`src/views/Home.vue`
**操作**：
- 在onMounted中调用`getRecommendArticles()`API
- 管理loading和error状态
- 将数据传递给ArticleCard组件
- 处理空数据状态
**验收标准**：首页能展示后端返回的推荐文章列表

#### 任务11：改造文章详情页，接入详情API
**描述**：在文章详情页调用详情API，展示完整内容
**文件**：`src/views/ArticleDetail.vue`
**操作**：
- 从路由参数获取articleId
- 调用`getArticleDetail(articleId)`API
- 使用AISummary组件展示AI摘要
- 使用Markdown工具渲染正文
- 显示文章指标和交互按钮
- 添加"阅读原文"按钮
**验收标准**：详情页能正确展示文章所有信息，Markdown渲染正常

#### 任务12：改造个人中心页（可选）
**描述**：在个人中心调用用户侧写API
**文件**：`src/views/InterestSetup.vue` 或新建页面
**操作**：
- 调用`getUserProfile()`API
- 展示AI评语和技术雷达
- 渲染核心技术栈（进度条或饼图）
**验收标准**：能展示用户AI侧写信息

---

### 阶段七：环境配置与测试

#### 任务13：创建环境变量配置文件
**描述**：创建开发和生产环境的配置文件
**文件**：`.env.development`、`.env.production`
**操作**：
- 创建.env.development配置开发环境API地址
- 创建.env.production配置生产环境API地址
**验收标准**：环境变量配置正确，可切换环境

#### 任务14：测试API调用和页面展示
**描述**：全面测试所有API调用和页面功能
**操作**：
- 测试首页推荐文章列表加载
- 测试文章详情页加载
- 测试Markdown渲染和代码高亮
- 测试错误处理（网络错误、401等）
- 测试loading状态展示
**验收标准**：所有功能正常，无报错，用户体验良好

---

## 任务执行顺序

建议按以下顺序执行任务：

1. 任务1（安装依赖）
2. 任务2、3、4（API基础架构）
3. 任务5、6（API模块）
4. 任务7（工具函数）
5. 任务8、9（组件开发）
6. 任务10、11、12（页面改造）
7. 任务13、14（环境配置与测试）

---

## 注意事项

1. **Mock数据保留**：在API未完全就绪时，可保留mockData.ts作为降级方案
2. **错误处理**：所有API调用都要有错误处理和用户提示
3. **Loading状态**：所有数据加载都要显示loading状态
4. **类型安全**：充分利用TypeScript类型检查，避免运行时错误
5. **性能优化**：考虑使用Pinia缓存API数据，减少重复请求
