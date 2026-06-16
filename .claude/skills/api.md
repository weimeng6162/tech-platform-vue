---
name: api
description: 生成 API 接口代码 — 在 src/api/ 下创建类型定义和 API 函数，遵循项目请求封装模式
---

# /api — 生成 API 接口代码

根据用户描述的后端接口，自动生成符合项目规范的 API 层代码。

## 项目 API 层模式

### 类型定义 → `src/api/types.ts`

所有请求/响应类型集中定义在此文件的对应区块。

```typescript
// 请求类型命名：<Method><Resource>Request
export interface CreateCommentRequest {
  articleId: string
  content: string
}

// 响应类型命名：<Resource>Response 或直接用实体类型
export interface CommentListResponse {
  list: Comment[]
  total: number
}
```

### API 函数 → `src/api/modules/<domain>.ts`

```typescript
import { get, post } from '../request'
import type { CreateCommentRequest, CommentListResponse } from '../types'

export function getArticleComments(articleId: string, page = 1, pageSize = 10) {
  return get<CommentListResponse>(`/api/articles/${articleId}/comments`, {
    params: { page, pageSize }
  })
}

export function createComment(data: CreateCommentRequest) {
  return post<{ commentId: string }>('/api/comments', data)
}
```

### 关键规则

- **只用 `get<T>` 和 `post<T>`**，从 `../request` 导入，不直接操作 axios
- **响应类型 `<T>` 是解包后的业务类型**（拦截器已剥离 `{ code, data }` 包装）
- **私有接口**（需要 token）要在 `src/api/config.ts` 的 `PRIVATE_ENDPOINTS` 中添加路径
- **路径前缀**用 `/api/`，不要写完整 URL（baseURL 由拦截器动态设置）
- **分页参数**：`page`、`pageSize`，默认 `page=1, pageSize=10`

## 生成流程

1. 确认接口路径、方法（GET/POST）、是否需要 token
2. 在 `src/api/types.ts` 尾部添加请求/响应类型
3. 在对应 `src/api/modules/<domain>.ts` 尾部添加 API 函数（如果 domain 文件不存在则新建）
4. 如需 token 保护，在 `src/api/config.ts` 的 `PRIVATE_ENDPOINTS` 中添加接口路径
5. 更新 `src/api/types.ts` 和 `src/api/modules/index.ts`（如果存在 barrel export）
