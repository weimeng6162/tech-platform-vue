---
name: review
description: 代码审查 — 审查当前 git diff（暂存区 + 工作区），检查类型安全、逻辑错误、安全漏洞、性能隐患、边界情况
---

# /review — 代码审查

审查当前分支上的所有未提交更改（staged + unstaged）。

## 审查流程

1. 运行 `git diff` 和 `git diff --cached` 获取所有待审查代码
2. 按以下维度逐文件审查：

### 检查项

- **类型安全**：有无 `any` 逃逸、缺少类型标注、不安全的类型断言
- **逻辑错误**：条件判断是否正确、异步操作是否正确 await、Promise 是否正确处理
- **安全漏洞**：XSS（v-html 有无转义）、敏感信息硬编码、Crypto 密钥是否硬编码在源码中
- **边界情况**：空值/undefined 处理、数组越界、并发竞态
- **项目规范**：是否符合 CLAUDE.md 中定义的编码规范、文件命名、目录结构
- **API 层**：请求是否正确使用 `get<T>` / `post<T>` 包装、类型是否定义在 `src/api/types.ts`

### 输出格式

```
## 审查：<分支名>

### 严重 (must fix)
- file:line — 问题描述 + 修复建议

### 建议 (should fix)
- file:line — 问题描述 + 修复建议

### 提示 (nice to have)
- file:line — 问题描述 + 修复建议
```

没有发现问题的维度直接跳过，不输出空段落。
