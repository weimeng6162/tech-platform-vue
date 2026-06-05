/**
 * Mock服务器
 * 使用Express模拟后端API，返回假数据
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 启用CORS
app.use(cors());

// 解析JSON请求体
app.use(express.json());

console.log('\n🚀 Mock服务器启动中...\n');

// 首页推荐文章列表
app.get('/api/articles/recommend', (req, res) => {
  console.log('[GET] /api/articles/recommend - 返回推荐文章列表');
  res.json({
    "code": 200,
    "msg": "success",
    "data": {
      "article_list": [
        {
          "article_id": "wx_9527",
          "title": "深入剖析 Go 语言 GMP 调度器底层原理",
          "author": "Go夜读",
          "publish_time": "2026-04-18T10:00:00Z",
          "category": "后端",
          "ai_summary": "文章详细分析了Go语言的GMP调度模型，阐述协程G、线程M、逻辑处理器P的交互关系，并通过源码剖析了任务窃取机制。",
          "tags": ["Go", "并发编程", "Goroutine", "底层原理"],
          "difficulty": "深度",
          "view_count": 1205,
          "is_collected": false
        },
        {
          "article_id": "fb_react19_compiler_3345",
          "title": "React 19 新时代：Compiler 与 Actions 实战解析",
          "author": "前端之巅",
          "publish_time": "2026-04-20T14:30:00Z",
          "category": "前端",
          "ai_summary": "文章深入解读 React 19 的核心更新：React Compiler 自动 memo 优化、Actions 处理表单与异步数据变更，以及 useOptimistic 等新 Hook 的使用场景。",
          "tags": ["React", "前端框架", "性能优化", "JavaScript"],
          "difficulty": "中级",
          "view_count": 2890,
          "is_collected": true
        },
        {
          "article_id": "py_fastapi_async_db_7789",
          "title": "FastAPI 异步数据库实战：SQLAlchemy 2.0 + Alembic 最佳实践",
          "author": "Python 开发者社区",
          "publish_time": "2026-04-15T09:15:00Z",
          "category": "后端",
          "ai_summary": "介绍如何在 FastAPI 中利用 SQLAlchemy 2.0 的异步特性进行数据库操作，包括连接池配置、事务管理、迁移工具 Alembic 的异步支持，并给出完整的项目结构。",
          "tags": ["Python", "FastAPI", "SQLAlchemy", "异步编程"],
          "difficulty": "中级",
          "view_count": 843,
          "is_collected": false
        },
        {
          "article_id": "ml_rag_langchain_6623",
          "title": "LLM RAG 系统从零到一：LangChain + Chroma + 本地模型落地",
          "author": "AI 前线",
          "publish_time": "2026-04-22T17:45:00Z",
          "category": "AI",
          "ai_summary": "手把手教你搭建检索增强生成（RAG）系统，包括文档分块、向量嵌入、相似性检索及 Prompt 优化，并对比了 Chroma 与 Pinecone 的差异。",
          "tags": ["大语言模型", "RAG", "LangChain", "Python"],
          "difficulty": "深度",
          "view_count": 3125,
          "is_collected": true
        },
        {
          "article_id": "db_postgres_15_4772",
          "title": "PostgreSQL 15 新特性：MERGE、JSON_TABLE 及性能提升 35% 的秘密",
          "author": "DBA 实战",
          "publish_time": "2026-04-10T11:20:00Z",
          "category": "数据库",
          "ai_summary": "全面解读 PostgreSQL 15 的重要更新：SQL 标准 MERGE 命令、JSON_TABLE 函数、逻辑复制改进、以及针对排序和分组聚合的优化，实测 TPC-H 提升明显。",
          "tags": ["PostgreSQL", "数据库", "SQL优化", "JSON"],
          "difficulty": "深度",
          "view_count": 987,
          "is_collected": true
        },
        {
          "article_id": "wx_1024",
          "title": "Docker 容器化部署前端 Vue3 项目实战",
          "author": "前端极客",
          "publish_time": "2026-04-19T14:30:00Z",
          "category": "前端",
          "ai_summary": "带你从零编写 Dockerfile，配置 Nginx 反向代理，利用多阶段构建把 Vue3 产物打包成极小体积的镜像文件。",
          "tags": ["Docker", "Vue3", "Nginx", "CI/CD"],
          "difficulty": "中级",
          "view_count": 890,
          "is_collected": true
        },
        {
          "article_id": "wx_2048",
          "title": "Kubernetes 微服务架构设计与实践",
          "author": "云原生布道师",
          "publish_time": "2026-04-17T09:15:00Z",
          "category": "后端",
          "ai_summary": "深入讲解K8s集群搭建、Service网格、Ingress路由、ConfigMap配置管理等核心概念，附带生产环境最佳实践。",
          "tags": ["Kubernetes", "微服务", "Docker", "云原生"],
          "difficulty": "深度",
          "view_count": 1567,
          "is_collected": false
        },
        {
          "article_id": "wx_4096",
          "title": "TypeScript 高级类型体操完全指南",
          "author": "类型魔法师",
          "publish_time": "2026-04-20T11:00:00Z",
          "category": "前端",
          "ai_summary": "从泛型、条件类型、映射类型到模板字面量类型，系统梳理TS类型系统的高级用法，助你写出类型安全的代码。",
          "tags": ["TypeScript", "类型系统", "前端"],
          "difficulty": "中级",
          "view_count": 723,
          "is_collected": false
        },
        {
          "article_id": "wx_8192",
          "title": "React 18 并发特性深度解析",
          "author": "React核心团队",
          "publish_time": "2026-04-16T16:20:00Z",
          "category": "前端",
          "ai_summary": "详解Concurrent Mode、Suspense、useTransition等新特性，揭示React如何实现时间切片和优先级调度。",
          "tags": ["React", "并发", "Hooks", "前端"],
          "difficulty": "深度",
          "view_count": 1089,
          "is_collected": true
        },
        {
          "article_id": "wx_16384",
          "title": "Python 异步编程最佳实践",
          "author": "Python之父",
          "publish_time": "2026-04-15T08:00:00Z",
          "category": "后端",
          "ai_summary": "从async/await语法到asyncio事件循环，深入讲解Python异步编程原理，对比多线程、多进程的优劣。",
          "tags": ["Python", "异步编程", "asyncio", "后端"],
          "difficulty": "中级",
          "view_count": 956,
          "is_collected": false
        },
        {
          "article_id": "os_linux_ebpf_1234",
          "title": "eBPF 完全指南：内核可编程时代的性能观测与网络魔法",
          "author": "Linux 内核之旅",
          "publish_time": "2026-04-25T08:00:00Z",
          "category": "操作系统",
          "ai_summary": "深入介绍 eBPF 技术原理、工具链（bpftrace、BCC）及典型应用场景：性能分析、网络过滤、安全监控。通过实战案例演示如何编写 eBPF 程序挂载到内核事件点。",
          "tags": ["eBPF", "Linux内核", "性能监控", "网络"],
          "difficulty": "深度",
          "view_count": 1560,
          "is_collected": true
        },
        {
          "article_id": "arch_ddd_5678",
          "title": "领域驱动设计 DDD 实战：从贫血模型到充血模型的演进",
          "author": "架构师之路",
          "publish_time": "2026-04-19T16:20:00Z",
          "category": "软件架构",
          "ai_summary": "通过电商订单系统案例，对比贫血模型与充血模型的优劣，讲解实体、值对象、聚合根、领域服务、事件风暴等 DDD 核心概念，并给出代码示例。",
          "tags": ["DDD", "Java", "微服务", "软件设计"],
          "difficulty": "深度",
          "view_count": 2340,
          "is_collected": true
        },
        {
          "article_id": "net_http3_quic_9012",
          "title": "HTTP/3 与 QUIC 协议详解：下一代 Web 传输性能革命",
          "author": "网络协议研究院",
          "publish_time": "2026-04-21T13:10:00Z",
          "category": "网络",
          "ai_summary": "分析 HTTP/3 基于 UDP 的 QUIC 协议如何解决队头阻塞、减少连接建立时间，并对比 TCP + TLS 1.3 的性能差异，提供 Nginx 开启 HTTP/3 的配置方法。",
          "tags": ["HTTP/3", "QUIC", "网络协议", "性能优化"],
          "difficulty": "深度",
          "view_count": 1820,
          "is_collected": true
        },
        {
          "article_id": "devops_k8s_gitops_3456",
          "title": "GitOps 实践指南：ArgoCD + Kustomize 实现声明式 Kubernetes 交付",
          "author": "DevOps 实战派",
          "publish_time": "2026-04-23T11:30:00Z",
          "category": "DevOps",
          "ai_summary": "介绍 GitOps 核心思想：以 Git 为单一真实源，使用 ArgoCD 自动同步集群状态。详细讲解 Kustomize 的 overlay 环境管理、Sealed Secrets 加密敏感信息及 CI 流水线整合。",
          "tags": ["Kubernetes", "GitOps", "ArgoCD", "Kustomize"],
          "difficulty": "深度",
          "view_count": 2750,
          "is_collected": false
        },
        {
          "article_id": "db_redis_6789",
          "title": "Redis 7.2 新特性：Sharded Pub/Sub、FUNCTION 命令及性能提升",
          "author": "缓存之道",
          "publish_time": "2026-04-17T09:40:00Z",
          "category": "数据库",
          "ai_summary": "介绍 Redis 7.2 的重要更新：分片 Pub/Sub 解决集群中广播消息放大问题；Redis Functions 替代 Lua 脚本的更好管理方式；以及新增的定长内存分配器带来的性能提升。",
          "tags": ["Redis", "缓存", "消息队列", "NoSQL"],
          "difficulty": "中级",
          "view_count": 1100,
          "is_collected": true
        },
        {
          "article_id": "ai_mlflow_abcde",
          "title": "MLflow 模型生命周期管理：从训练到部署的 MLOps 实战",
          "author": "机器学习工程化",
          "publish_time": "2026-04-24T18:00:00Z",
          "category": "AI",
          "ai_summary": "介绍开源平台 MLflow 的四大组件：Tracking、Projects、Models、Model Registry。通过 Scikit-learn 示例演示如何记录实验参数、打包代码、注册模型以及部署到 REST API。",
          "tags": ["MLOps", "MLflow", "Python", "模型部署"],
          "difficulty": "中级",
          "view_count": 980,
          "is_collected": false
        },
        {
          "article_id": "front_vue3_composition_7890",
          "title": "Vue 3.4+ Composition API 最佳实践：响应式、组合式函数与泛型组件",
          "author": "Vue 技术社区",
          "publish_time": "2026-04-16T14:50:00Z",
          "category": "前端",
          "ai_summary": "深入 Vue 3 组合式 API 的高级用法：使用 ref、computed、watch 的注意事项，组合式函数的设计模式，defineProps 泛型支持，以及性能优化技巧（shallowRef 等）。",
          "tags": ["Vue", "前端框架", "TypeScript", "响应式"],
          "difficulty": "中级",
          "view_count": 2040,
          "is_collected": false
        },
        {
          "article_id": "rust_async_tokio_6543",
          "title": "Tokio 异步运行时剖析：任务调度、I/O 驱动与工作窃取",
          "author": "Rust 中文社区",
          "publish_time": "2026-04-26T07:15:00Z",
          "category": "后端",
          "ai_summary": "解析 Tokio 的核心设计：多线程工作窃取调度器、反应器（Reactor）+ 执行器（Executor）模型、异步 I/O 的 epoll/kqueue 封装，以及 async/await 底层原理。",
          "tags": ["Rust", "异步编程", "Tokio", "系统编程"],
          "difficulty": "深度",
          "view_count": 1420,
          "is_collected": true
        },
        {
          "article_id": "db_clickhouse_4321",
          "title": "ClickHouse 实时分析引擎：列式存储、向量化执行与物化视图实战",
          "author": "大数据技术栈",
          "publish_time": "2026-04-14T10:30:00Z",
          "category": "数据库",
          "ai_summary": "介绍 ClickHouse 的列式存储原理、向量化查询执行引擎、数据分区与索引设计，并演示如何通过物化视图加速聚合查询，对比传统数据库的性能优势。",
          "tags": ["ClickHouse", "OLAP", "大数据", "列式存储"],
          "difficulty": "中级",
          "view_count": 830,
          "is_collected": false
        },
        {
          "article_id": "sec_oauth_jwt_9876",
          "title": "OAuth 2.0 与 JWT 详解：授权码流程、令牌安全与常见漏洞",
          "author": "安全开发",
          "publish_time": "2026-04-12T12:00:00Z",
          "category": "安全",
          "ai_summary": "讲解 OAuth 2.0 四种授权模式（重点授权码模式），JWT 结构（Header、Payload、Signature），签名算法选择（HS256 vs RS256），以及重定向 URI 篡改、CSRF、令牌泄露等防御措施。",
          "tags": ["OAuth2", "JWT", "安全", "认证授权"],
          "difficulty": "中级",
          "view_count": 2170,
          "is_collected": true
        },
        {
          "article_id": "8927134672224257",
          "title": "//go:fix inline and the source-level inliner - The Go Programming Language",
          "author": "未知作者",
          "publish_time": "",
          "category": "后端",
          "ai_summary": "Go 语言推出 go:fix inline 指令，利用源级内联工具消除废弃函数调用。该机制通过构建约束系统处理副作用与局部变量引用，自动迁移 API 设计缺陷并优化代码整洁度，属于编译器层面的高级优化技术。",
          "tags": ["后端开发", "编译器原理", "源码分析", "性能调优"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8927188409647105",
          "title": "拒绝 AI 焦虑！一个普通程序员的真实 AI 工作流（附成本账单）",
          "author": "掘金 - 此方的手帐",
          "publish_time": "",
          "category": "算法与AI",
          "ai_summary": "普通 Node.js 程序员分享真实 AI 工作流，展示 Cursor、DeepSeek、Trae、OpenClaw 等工具在代码编写、文档生成及自媒体运营中的具体用法。阐述 AI 如何替代重复性任务并拓展创作能力，从写码者转型为审码者，文末引导关注公众号获取资讯。",
          "tags": ["人工智能", "大模型应用", "提示词工程", "自动化开发", "内容创作", "含商业推广"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8918497862090753",
          "title": "超越 Vibe Coding —— AI 辅助编程指南",
          "author": "掘金 - 冴羽",
          "publish_time": "",
          "category": "前端",
          "ai_summary": "文章深入探讨 Vibe Coding 与 AI 辅助工程的差异，指出盲目依赖 AI 导致的安全隐患。提供从数据模型定义到组件库构建的七步规范流程，涵盖 React hooks 调试、JWT 验证及边界情况处理等实战技巧，并强调架构决策的重要性。",
          "tags": ["人工智能", "React", "Vibe Coding", "AI-Assisted Engineering", "安全漏洞防护", "性能优化", "含商业推广"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8918354400116737",
          "title": "Codex 穷鬼大救星",
          "author": "掘金 - 小呆呆666",
          "publish_time": "",
          "category": "算法与AI",
          "ai_summary": "文章介绍Codex_with_cc开源项目，通过引入子代理工作流解决主线程上下文爆炸与Token消耗过快问题。核心机制是将读日志、改文件等苦活委派给Claude Code执行层，主线程仅负责架构设计与结果审核，实现分层处理以提升AI开发效率与可审计性。",
          "tags": ["人工智能", "大模型应用", "多智能体协作", "上下文管理", "代码生成优化"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8927138916859905",
          "title": "I Built a PDF Conversion API So You Don't Have to Install Ghostscript - DEV Community",
          "author": "未知作者",
          "publish_time": "",
          "category": "后端",
          "ai_summary": "作者构建了一个无需安装 Ghostscript 依赖的 PDF 转换 HTTP API。采用 Node.js 22、Hono 框架及 PostgreSQL 数据库，支持 JWT 认证与 Bearer Token。通过 Lemon Squeezy 处理支付税务问题，提供按次计费模式，旨在简化开发者的文件转换工作流，解决 Docker 环境部署痛点。",
          "tags": ["后端开发", "云原生", "HTTP API 设计", "PDF 处理", "微服务架构"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8927134135353345",
          "title": "AI Coding agents 的 UI 困境：终端正在成为工作空间而非工具 - OSCHINA - 开源 × AI · 开发者生态社区",
          "author": "Firecrawl - 重装破拆",
          "publish_time": "",
          "category": "运维与安全",
          "ai_summary": "探讨AI coding agents将终端从命令接口转变为有状态工作空间的趋势。指出传统线性UI难以监督多进程、保留意图及解释决策，导致注意力瓶颈。文章分析Git worktrees等空间化工作流的必要性，并对比IDE与云端代理的优劣，强调未来工具需突破打字速度限制，解决开发者对复杂agent状态的信任与管理难题。",
          "tags": ["人工智能", "开发工具", "用户界面设计", "自动化代理", "工作流管理"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8918492778594305",
          "title": "当 Codex 成为主力，软件工程的重心已经变了",
          "author": "掘金 - Tree1024",
          "publish_time": "",
          "category": "算法与AI",
          "ai_summary": "文章解析OpenAI利用Codex进行软件工程的内部实验，展示从空仓库到交付产品的过程。核心观点是将设计原则、架构约束等知识结构化并沉淀进版本化仓库文件，而非依赖非结构化的文档或口头共识。通过暴露日志指标和接入浏览器协议，让智能体具备复现问题与修复代码的能力，实现低成本高效开发。",
          "tags": ["人工智能", "软件工程", "智能体开发", "代码生成", "自动化运维"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8918495110627329",
          "title": "字节外包一年，我的技术成长之路",
          "author": "掘金 - 新酱爱学习",
          "publish_time": "",
          "category": "代码人生",
          "ai_summary": "作者回顾字节外包经历，分享从普通开发成长为组长的路径。涵盖 SaaS 商城架构、性能优化策略及大模型生成 TS 类型等提效实践。强调在复杂组织架构下的协作与成长，倡导脚踏实地应对行业焦虑。",
          "tags": ["前端工程化", "大模型应用", "高并发调优", "自动化运维", "代码人生"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8927140024156161",
          "title": "卧槽！Claude Code 官方插件市场，这波直接让 AI 辅助开发起飞了！",
          "author": "掘金 - 路明非Ricardo",
          "publish_time": "",
          "category": "其他",
          "ai_summary": "文章介绍 Anthropic 开源的 Claude Code 官方插件市场，包含超过两万 Star。详细解析了斜杠命令、子智能体、Skills 文件及 MCP Servers 等核心组件。列举了 hookify、mcp-registry 等多个实用插件安装指令与功能，展示了如何通过自然语言配置实现代码审查、数据库连接及终端拦截，旨在帮助开发者提升 AI 辅助编程效率。",
          "tags": ["开发工具", "人工智能", "软件工程", "自动化运维", "提示词工程"],
          "difficulty": "入门",
          "view_count": 0,
          "is_collected": false
        },
        {
          "article_id": "8927167203246081",
          "title": "《HelloGitHub 月刊》第 120 期 - HelloGitHub",
          "author": "未知作者",
          "publish_time": "",
          "category": "其他",
          "ai_summary": "本期《HelloGitHub》第 120 期汇集了多语言开源项目，涵盖 Go 语言浏览器控制代理、React WebGPU 3D 编辑器、零依赖 UI 库及 Python 智能体开发框架等实用工具与前沿技术。",
          "tags": ["后端开发", "前端工程化", "人工智能", "Python 框架", "Go 语言"],
          "difficulty": "进阶",
          "view_count": 0,
          "is_collected": false
        }
      ]
    }
  });
});

// 文章详情
app.get('/api/articles/detail', (req, res) => {
  const articleId = req.query.article_id;
  console.log(`[GET] /api/articles/detail?article_id=${articleId} - 返回文章详情`);

  res.json({
    "code": 200,
    "msg": "success",
    "data": {
      "article_id": articleId || "wx_9527",
      "title": "深入剖析 Go 语言 GMP 调度器底层原理",
      "author": "Go夜读",
      "publish_time": "2026-04-18T10:00:00Z",
      "category": "后端",
      "ai_summary": "文章详细分析了Go语言的GMP调度模型，阐述协程G、线程M、逻辑处理器P的交互关系，并通过源码剖析了任务窃取机制。",
      "tags": ["Go", "并发编程", "Goroutine", "底层原理"],
      "content": `## 1. 什么是 GMP 模型？

在 Go 语言中，Goroutine 的调度是其高并发的核心。GMP 分别代表：
- **G (Goroutine)**: 用户态的轻量级线程。
- **M (Machine)**: 操作系统级别的线程。
- **P (Processor)**: 逻辑处理器，包含运行 G 的本地队列。

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, GMP!")
}
\`\`\`

### 2. 任务窃取 (Work Stealing)

当某个 P 的本地队列为空时，它会尝试从其他 P 的队列中"窃取"一半的 G 过来执行，这保证了 CPU 资源的极致利用率。

\`\`\`go
// 任务窃取伪代码
func stealWork() {
    if localQueue.empty() {
        target := randomOtherP()
        half := target.queue.len() / 2
        for i := 0; i < half; i++ {
            g := target.queue.pop()
            localQueue.push(g)
        }
    }
}
\`\`\`

### 3. 调度器的生命周期

1. **初始化**：runtime 启动时创建初始的 M 和 P
2. **创建 G**：通过 go 关键字创建新的 Goroutine
3. **调度循环**：M 不断从 P 的队列中获取 G 执行
4. **系统调用**：当 G 进行系统调用时，M 会阻塞，P 会绑定到其他 M
5. **退出**：程序结束时清理所有资源

### 4. 性能优化建议

- **控制并发数量**：使用 \`semaphore\` 或 \`worker pool\` 限制并发
- **避免创建过多 G**：复用 Goroutine 而非频繁创建销毁
- **合理设置 GOMAXPROCS**：通常等于 CPU 核心数

---

*本文深入剖析了 Go 语言调度器的底层实现，希望对您有所帮助！*`,
      "metrics": {
        "view_count": 1205,
        "like_count": 342,
        "collect_count": 89
      },
      "interaction_status": {
        "is_liked": true,
        "is_collected": false
      },
      "original_url": "https://mp.weixin.qq.com/s/xxxxxx"
    }
  });
});

// 用户侧写
app.get('/api/user/profile', (req, res) => {
  console.log('[GET] /api/user/profile - 返回用户侧写');
  res.json({
    "code": 200,
    "msg": "success",
    "data": {
      "user_id": "dev_001",
      "nickname": "代码不加糖",
      "avatar_url": "https://example.com/avatar.png",
      "ai_analysis": {
        "ai_profile_summary": "该用户深度聚焦云原生架构，高频涉猎 Go 语言、Kubernetes 编排及 Docker 虚拟化，结合微服务实践，正攻坚高并发后端系统重构。",
        "technical_level": "资深探索者",
        "core_interests": [
          {"name": "Go", "weight": 85},
          {"name": "Kubernetes", "weight": 70},
          {"name": "微服务", "weight": 65},
          {"name": "Docker", "weight": 60},
          {"name": "TypeScript", "weight": 45}
        ]
      }
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ Mock服务器已启动！`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`\n📡 可用的API接口:`);
  console.log(`   GET http://localhost:${PORT}/api/articles/recommend`);
  console.log(`   GET http://localhost:${PORT}/api/articles/detail?article_id=xxx`);
  console.log(`   GET http://localhost:${PORT}/api/user/profile`);
  console.log(`\n💡 提示: 按 Ctrl+C 停止服务器\n`);
});
