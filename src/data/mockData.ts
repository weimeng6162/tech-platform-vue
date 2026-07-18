// 文章详情内容
export const articleContent = `# 深入理解 Vue 3 的响应式原理

Vue 3 使用 Proxy 实现了全新的响应式系统，这标志着 Vue 在响应式架构上的重大升级。

## 什么是响应式？

响应式系统允许我们声明式地描述数据和 UI 之间的关系：

\`\`\`typescript
import { ref, reactive, computed, watch } from 'vue'

// ref 用于基本类型
const count = ref(0)

// reactive 用于对象
const state = reactive({
  name: 'Vue',
  version: 3
})

// 计算属性
const doubled = computed(() => count.value * 2)

// 侦听器
watch(count, (newVal) => {
  console.log('count changed:', newVal)
})
\`\`\`

## Proxy 的优势

相比 Vue 2 的 Object.defineProperty：

1. **性能更好** - 惰性响应，只有被访问的属性才会变成响应式
2. **功能更强** - 可以检测数组索引和长度变化
3. **代码更简洁** - 不需要 $set 和 $delete

## 响应式原理

\`\`\`typescript
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key) // 收集依赖
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key) // 触发更新
      return result
    }
  })
}
\`\`\`

## 最佳实践

1. **使用 ref 处理基本类型**
2. **使用 reactive 处理对象**
3. **避免解构 reactive 对象**
4. **合理使用 shallowRef 和 shallowReactive**

## 总结

Vue 3 的响应式系统基于 Proxy，提供了更强大的功能和更好的性能。
`

// ========== 新增：AI 推荐文章数据 ==========
export const recommendArticlesData = {
  code: 200,
  msg: 'success',
  data: {
    article_list: [
      {
        article_id: 'wx_9527',
        title: '深入剖析 Go 语言 GMP 调度器底层原理',
        author: 'Go夜读',
        publish_time: '2026-04-18T10:00:00Z',
        category: '后端',
        ai_summary:
          '文章详细分析了Go语言的GMP调度模型，阐述协程G、线程M、逻辑处理器P的交互关系，并通过源码剖析了任务窃取机制。',
        tags: ['go', 'backend', 'algorithm'],
        difficulty: '深度' as const,
        view_count: 1205,
        is_collected: false,
      },
      {
        article_id: 'wx_1024',
        title: 'Docker 容器化部署前端 Vue3 项目实战',
        author: '前端极客',
        publish_time: '2026-04-19T14:30:00Z',
        category: '前端',
        ai_summary:
          '带你从零编写 Dockerfile，配置 Nginx 反向代理，利用多阶段构建把 Vue3 产物打包成极小体积的镜像文件。',
        tags: ['docker', 'vue', 'frontend'],
        difficulty: '中级' as const,
        view_count: 890,
        is_collected: true,
      },
      {
        article_id: 'wx_2048',
        title: 'Kubernetes 生产环境高可用架构设计',
        author: '云原生布道师',
        publish_time: '2026-04-17T09:15:00Z',
        category: '后端',
        ai_summary:
          '详解 K8s 多集群部署方案，涵盖 etcd 集群配置、控制平面高可用、Pod 反亲和策略及自动故障转移机制。',
        tags: ['kubernetes', 'devops', 'cloud'],
        difficulty: '深度' as const,
        view_count: 1567,
        is_collected: false,
      },
      {
        article_id: 'wx_4096',
        title: 'TypeScript 高级类型体操完全指南',
        author: '类型魔法师',
        publish_time: '2026-04-16T16:45:00Z',
        category: '前端',
        ai_summary:
          '从泛型、条件类型到模板字面量类型，通过实战案例带你掌握 TS 类型系统的终极奥义。',
        tags: ['typescript', 'frontend', 'javascript'],
        difficulty: '中级' as const,
        view_count: 2341,
        is_collected: true,
      },
      // ========== 测试安全标签的文章 ==========
    {
      article_id: 'fb_react19_compiler_3345',
      title: 'React 19 新时代：Compiler 与 Actions 实战解析',
      author: '前端之巅',
      publish_time: '2026-04-20T14:30:00Z',
      category: '前端',
      ai_summary:
        '文章深入解读 React 19 的核心更新：React Compiler 自动 memo 优化、Actions 处理表单与异步数据变更，以及 useOptimistic 等新 Hook 的使用场景。',
      tags: ['react', 'frontend', 'javascript'],
      difficulty: '中级' as const,
      view_count: 2890,
      is_collected: true,
    },
    {
      article_id: 'py_fastapi_async_db_7789',
      title: 'FastAPI 异步数据库实战：SQLAlchemy 2.0 + Alembic 最佳实践',
      author: 'Python 开发者社区',
      publish_time: '2026-04-15T09:15:00Z',
      category: '后端',
      ai_summary:
        '介绍如何在 FastAPI 中利用 SQLAlchemy 2.0 的异步特性进行数据库操作，包括连接池配置、事务管理、迁移工具 Alembic 的异步支持，并给出完整的项目结构。',
      tags: ['python', 'fastapi', 'sqlalchemy'],
      difficulty: '中级' as const,
      view_count: 843,
      is_collected: false,
    },
    {
      article_id: 'ml_rag_langchain_6623',
      title: 'LLM RAG 系统从零到一：LangChain + Chroma + 本地模型落地',
      author: 'AI 前线',
      publish_time: '2026-04-22T17:45:00Z',
      category: 'AI',
      ai_summary:
        '手把手教你搭建检索增强生成（RAG）系统，包括文档分块、向量嵌入、相似性检索及 Prompt 优化，并对比了 Chroma 与 Pinecone 的差异。',
      tags: ['llm', 'aigc', 'python'],
      difficulty: '深度' as const,
      view_count: 3125,
      is_collected: true,
    },
    {
      article_id: 'db_postgres_15_4772',
      title: 'PostgreSQL 15 新特性：MERGE、JSON_TABLE 及性能提升 35% 的秘密',
      author: 'DBA 实战',
      publish_time: '2026-04-10T11:20:00Z',
      category: '数据库',
      ai_summary:
        '全面解读 PostgreSQL 15 的重要更新：SQL 标准 MERGE 命令、JSON_TABLE 函数、逻辑复制改进、以及针对排序和分组聚合的优化，实测 TPC-H 提升明显。',
      tags: ['postgresql', 'database', 'sql'],
      difficulty: '深度' as const,
      view_count: 987,
      is_collected: true,
    },
    {
      article_id: 'os_linux_ebpf_1234',
      title: 'eBPF 完全指南：内核可编程时代的性能观测与网络魔法',
      author: 'Linux 内核之旅',
      publish_time: '2026-04-25T08:00:00Z',
      category: '操作系统',
      ai_summary:
        '深入介绍 eBPF 技术原理、工具链（bpftrace、BCC）及典型应用场景：性能分析、网络过滤、安全监控。通过实战案例演示如何编写 eBPF 程序挂载到内核事件点。',
      tags: ['ebpf', 'linux内核', '性能监控', '网络'],
      difficulty: '深度' as const,
      view_count: 1560,
      is_collected: true,
    },
    {
      article_id: 'arch_ddd_5678',
      title: '领域驱动设计 DDD 实战：从贫血模型到充血模型的演进',
      author: '架构师之路',
      publish_time: '2026-04-19T16:20:00Z',
      category: '软件架构',
      ai_summary:
        '通过电商订单系统案例，对比贫血模型与充血模型的优劣，讲解实体、值对象、聚合根、领域服务、事件风暴等 DDD 核心概念，并给出代码示例。',
      tags: ['ddd', 'java', '微服务', '软件设计'],
      difficulty: '深度' as const,
      view_count: 2340,
      is_collected: true,
    },
    {
      article_id: 'net_http3_quic_9012',
      title: 'HTTP/3 与 QUIC 协议详解：下一代 Web 传输性能革命',
      author: '网络协议研究院',
      publish_time: '2026-04-21T13:10:00Z',
      category: '网络',
      ai_summary:
        '分析 HTTP/3 基于 UDP 的 QUIC 协议如何解决队头阻塞、减少连接建立时间，并对比 TCP + TLS 1.3 的性能差异，提供 Nginx 开启 HTTP/3 的配置方法。',
      tags: ['http/3', 'quic', '网络协议', '性能优化'],
      difficulty: '深度' as const,
      view_count: 1820,
      is_collected: true,
    },
    {
      article_id: 'devops_k8s_gitops_3456',
      title: 'GitOps 实践指南：ArgoCD + Kustomize 实现声明式 Kubernetes 交付',
      author: 'DevOps 实战派',
      publish_time: '2026-04-23T11:30:00Z',
      category: 'DevOps',
      ai_summary:
        '介绍 GitOps 核心思想：以 Git 为单一真实源，使用 ArgoCD 自动同步集群状态。详细讲解 Kustomize 的 overlay 环境管理、Sealed Secrets 加密敏感信息及 CI 流水线整合。',
      tags: ['kubernetes', 'gitops', 'argocd', 'kustomize'],
      difficulty: '深度' as const,
      view_count: 2750,
      is_collected: false,
    },
    {
      article_id: 'db_redis_6789',
      title: 'Redis 7.2 新特性：Sharded Pub/Sub、FUNCTION 命令及性能提升',
      author: '缓存之道',
      publish_time: '2026-04-17T09:40:00Z',
      category: '数据库',
      ai_summary:
        '介绍 Redis 7.2 的重要更新：分片 Pub/Sub 解决集群中广播消息放大问题；Redis Functions 替代 Lua 脚本的更好管理方式；以及新增的定长内存分配器带来的性能提升。',
      tags: ['redis', '缓存', '消息队列', 'nosql'],
      difficulty: '中级' as const,
      view_count: 1100,
      is_collected: true,
    },
    {
      article_id: 'ai_mlflow_abcde',
      title: 'MLflow 模型生命周期管理：从训练到部署的 MLOps 实战',
      author: '机器学习工程化',
      publish_time: '2026-04-24T18:00:00Z',
      category: 'AI',
      ai_summary:
        '介绍开源平台 MLflow 的四大组件：Tracking、Projects、Models、Model Registry。通过 Scikit-learn 示例演示如何记录实验参数、打包代码、注册模型以及部署到 REST API。',
      tags: ['mlops', 'mlflow', 'python', '模型部署'],
      difficulty: '中级' as const,
      view_count: 980,
      is_collected: false,
    },
    {
      article_id: 'front_vue3_composition_7890',
      title: 'Vue 3.4+ Composition API 最佳实践：响应式、组合式函数与泛型组件',
      author: 'Vue 技术社区',
      publish_time: '2026-04-16T14:50:00Z',
      category: '前端',
      ai_summary:
        '深入 Vue 3 组合式 API 的高级用法：使用 ref、computed、watch 的注意事项，组合式函数的设计模式，defineProps 泛型支持，以及性能优化技巧（shallowRef 等）。',
      tags: ['vue', 'frontend', 'typescript', '响应式'],
      difficulty: '中级' as const,
      view_count: 2040,
      is_collected: false,
    },
    {
      article_id: 'rust_async_tokio_6543',
      title: 'Tokio 异步运行时剖析：任务调度、I/O 驱动与工作窃取',
      author: 'Rust 中文社区',
      publish_time: '2026-04-26T07:15:00Z',
      category: '后端',
      ai_summary:
        '解析 Tokio 的核心设计：多线程工作窃取调度器、反应器（Reactor）+ 执行器（Executor）模型、异步 I/O 的 epoll/kqueue 封装，以及 async/await 底层原理。',
      tags: ['rust', '异步编程', 'tokio', '系统编程'],
      difficulty: '深度' as const,
      view_count: 1420,
      is_collected: true,
    },
    {
      article_id: 'db_clickhouse_4321',
      title: 'ClickHouse 实时分析引擎：列式存储、向量化执行与物化视图实战',
      author: '大数据技术栈',
      publish_time: '2026-04-14T10:30:00Z',
      category: '数据库',
      ai_summary:
        '介绍 ClickHouse 的列式存储原理、向量化查询执行引擎、数据分区与索引设计，并演示如何通过物化视图加速聚合查询，对比传统数据库的性能优势。',
      tags: ['clickhouse', 'olap', '大数据', '列式存储'],
      difficulty: '中级' as const,
      view_count: 830,
      is_collected: false,
    },
    {
      article_id: 'sec_oauth_jwt_9876',
      title: 'OAuth 2.0 与 JWT 详解：授权码流程、令牌安全与常见漏洞',
      author: '安全开发',
      publish_time: '2026-04-12T12:00:00Z',
      category: '安全',
      ai_summary:
        '讲解 OAuth 2.0 四种授权模式（重点授权码模式），JWT 结构（Header、Payload、Signature），签名算法选择（HS256 vs RS256），以及重定向 URI 篡改、CSRF、令牌泄露等防御措施。',
      tags: ['oauth2', 'jwt', '安全', '认证授权'],
      difficulty: '中级' as const,
      view_count: 2170,
      is_collected: true,
    },
    {
      article_id: '8927134672224257',
      title: '//go:fix inline and the source-level inliner - The Go Programming Language',
      author: '未知作者',
      publish_time: '',
      category: '后端',
      ai_summary:
        'Go 语言推出 go:fix inline 指令，利用源级内联工具消除废弃函数调用。该机制通过构建约束系统处理副作用与局部变量引用，自动迁移 API 设计缺陷并优化代码整洁度，属于编译器层面的高级优化技术。',
      tags: ['后端开发', '编译器原理', '源码分析', '性能调优'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8927188409647105',
      title: '拒绝 AI 焦虑！一个普通程序员的真实 AI 工作流（附成本账单）',
      author: '掘金 - 此方的手帐',
      publish_time: '',
      category: '算法与AI',
      ai_summary:
        '普通 Node.js 程序员分享真实 AI 工作流，展示 Cursor、DeepSeek、Trae、OpenClaw 等工具在代码编写、文档生成及自媒体运营中的具体用法。阐述 AI 如何替代重复性任务并拓展创作能力，从写码者转型为审码者，文末引导关注公众号获取资讯。',
      tags: ['人工智能', '大模型应用', '提示词工程', '自动化开发', '内容创作', '含商业推广'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8918497862090753',
      title: '超越 Vibe Coding —— AI 辅助编程指南',
      author: '掘金 - 冴羽',
      publish_time: '',
      category: '前端',
      ai_summary:
        '文章深入探讨 Vibe Coding 与 AI 辅助工程的差异，指出盲目依赖 AI 导致的安全隐患。提供从数据模型定义到组件库构建的七步规范流程，涵盖 React hooks 调试、JWT 验证及边界情况处理等实战技巧，并强调架构决策的重要性。',
      tags: ['人工智能', 'React', 'Vibe Coding', 'AI-Assisted Engineering', '安全漏洞防护', '性能优化', '含商业推广'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8918354400116737',
      title: 'Codex 穷鬼大救星',
      author: '掘金 - 小呆呆666',
      publish_time: '',
      category: '算法与AI',
      ai_summary:
        '文章介绍Codex_with_cc开源项目，通过引入子代理工作流解决主线程上下文爆炸与Token消耗过快问题。核心机制是将读日志、改文件等苦活委派给Claude Code执行层，主线程仅负责架构设计与结果审核，实现分层处理以提升AI开发效率与可审计性。',
      tags: ['人工智能', '大模型应用', '多智能体协作', '上下文管理', '代码生成优化'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8927138916859905',
      title: "I Built a PDF Conversion API So You Don't Have to Install Ghostscript - DEV Community",
      author: '未知作者',
      publish_time: '',
      category: '后端',
      ai_summary:
        '作者构建了一个无需安装 Ghostscript 依赖的 PDF 转换 HTTP API。采用 Node.js 22、Hono 框架及 PostgreSQL 数据库，支持 JWT 认证与 Bearer Token。通过 Lemon Squeezy 处理支付税务问题，提供按次计费模式，旨在简化开发者的文件转换工作流，解决 Docker 环境部署痛点。',
      tags: ['后端开发', '云原生', 'HTTP API 设计', 'PDF 处理', '微服务架构'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8927134135353345',
      title: 'AI Coding agents 的 UI 困境：终端正在成为工作空间而非工具 - OSCHINA - 开源 × AI · 开发者生态社区',
      author: 'Firecrawl - 重装破拆',
      publish_time: '',
      category: '运维与安全',
      ai_summary:
        '探讨AI coding agents将终端从命令接口转变为有状态工作空间的趋势。指出传统线性UI难以监督多进程、保留意图及解释决策，导致注意力瓶颈。文章分析Git worktrees等空间化工作流的必要性，并对比IDE与云端代理的优劣，强调未来工具需突破打字速度限制，解决开发者对复杂agent状态的信任与管理难题。',
      tags: ['人工智能', '开发工具', '用户界面设计', '自动化代理', '工作流管理'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8918492778594305',
      title: '当 Codex 成为主力，软件工程的重心已经变了',
      author: '掘金 - Tree1024',
      publish_time: '',
      category: '算法与AI',
      ai_summary:
        '文章解析OpenAI利用Codex进行软件工程的内部实验，展示从空仓库到交付产品的过程。核心观点是将设计原则、架构约束等知识结构化并沉淀进版本化仓库文件，而非依赖非结构化的文档或口头共识。通过暴露日志指标和接入浏览器协议，让智能体具备复现问题与修复代码的能力，实现低成本高效开发。',
      tags: ['人工智能', '软件工程', '智能体开发', '代码生成', '自动化运维'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8918495110627329',
      title: '字节外包一年，我的技术成长之路',
      author: '掘金 - 新酱爱学习',
      publish_time: '',
      category: '代码人生',
      ai_summary:
        '作者回顾字节外包经历，分享从普通开发成长为组长的路径。涵盖 SaaS 商城架构、性能优化策略及大模型生成 TS 类型等提效实践。强调在复杂组织架构下的协作与成长，倡导脚踏实地应对行业焦虑。',
      tags: ['前端工程化', '大模型应用', '高并发调优', '自动化运维', '代码人生'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8927140024156161',
      title: '卧槽！Claude Code 官方插件市场，这波直接让 AI 辅助开发起飞了！',
      author: '掘金 - 路明非Ricardo',
      publish_time: '',
      category: '其他',
      ai_summary:
        '文章介绍 Anthropic 开源的 Claude Code 官方插件市场，包含超过两万 Star。详细解析了斜杠命令、子智能体、Skills 文件及 MCP Servers 等核心组件。列举了 hookify、mcp-registry 等多个实用插件安装指令与功能，展示了如何通过自然语言配置实现代码审查、数据库连接及终端拦截，旨在帮助开发者提升 AI 辅助编程效率。',
      tags: ['开发工具', '人工智能', '软件工程', '自动化运维', '提示词工程'],
      difficulty: '入门' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: '8927167203246081',
      title: '《HelloGitHub 月刊》第 120 期 - HelloGitHub',
      author: '未知作者',
      publish_time: '',
      category: '其他',
      ai_summary:
        '本期《HelloGitHub》第 120 期汇集了多语言开源项目，涵盖 Go 语言浏览器控制代理、React WebGPU 3D 编辑器、零依赖 UI 库及 Python 智能体开发框架等实用工具与前沿技术。',
      tags: ['后端开发', '前端工程化', '人工智能', 'Python 框架', 'Go 语言'],
      difficulty: '进阶' as const,
      view_count: 0,
      is_collected: false,
    },
    {
      article_id: 'wx_blocked_1',
      title: 'eBPF 完全指南：内核可编程时代的性能观测与网络魔法',
      author: 'Linux 内核之旅',
      publish_time: '2026-04-25T08:00:00Z',
      category: '操作系统',
      ai_summary:
        '深入介绍 eBPF 技术原理、工具链（bpftrace、BCC）及典型应用场景：性能分析、网络过滤、安全监控。通过实战案例演示如何编写 eBPF 程序挂载到内核事件点。',
      tags: ['ebpf', 'linux内核', '性能监控', '网络'],
      difficulty: '深度' as const,
      view_count: 1560,
      is_collected: true,
    },
    {
      article_id: 'arch_ddd_5678',
      title: '领域驱动设计 DDD 实战：从贫血模型到充血模型的演进',
      author: '架构师之路',
      publish_time: '2026-04-19T16:20:00Z',
      category: '软件架构',
      ai_summary:
        '通过电商订单系统案例，对比贫血模型与充血模型的优劣，讲解实体、值对象、聚合根、领域服务、事件风暴等 DDD 核心概念，并给出代码示例。',
      tags: ['ddd', 'java', '微服务', '软件设计'],
      difficulty: '深度' as const,
      view_count: 2340,
      is_collected: true,
    },
    {
      article_id: 'net_http3_quic_9012',
      title: 'HTTP/3 与 QUIC 协议详解：下一代 Web 传输性能革命',
      author: '网络协议研究院',
      publish_time: '2026-04-21T13:10:00Z',
      category: '网络',
      ai_summary:
        '分析 HTTP/3 基于 UDP 的 QUIC 协议如何解决队头阻塞、减少连接建立时间，并对比 TCP + TLS 1.3 的性能差异，提供 Nginx 开启 HTTP/3 的配置方法。',
      tags: ['http/3', 'quic', '网络协议', '性能优化'],
      difficulty: '深度' as const,
      view_count: 1820,
      is_collected: true,
    },
    {
      article_id: 'devops_k8s_gitops_3456',
      title: 'GitOps 实践指南：ArgoCD + Kustomize 实现声明式 Kubernetes 交付',
      author: 'DevOps 实战派',
      publish_time: '2026-04-23T11:30:00Z',
      category: 'DevOps',
      ai_summary:
        '介绍 GitOps 核心思想：以 Git 为单一真实源，使用 ArgoCD 自动同步集群状态。详细讲解 Kustomize 的 overlay 环境管理、Sealed Secrets 加密敏感信息及 CI 流水线整合。',
      tags: ['kubernetes', 'gitops', 'argocd', 'kustomize'],
      difficulty: '深度' as const,
      view_count: 2750,
      is_collected: false,
    },
    {
      article_id: 'db_redis_6789',
      title: 'Redis 7.2 新特性：Sharded Pub/Sub、FUNCTION 命令及性能提升',
      author: '缓存之道',
      publish_time: '2026-04-17T09:40:00Z',
      category: '数据库',
      ai_summary:
        '介绍 Redis 7.2 的重要更新：分片 Pub/Sub 解决集群中广播消息放大问题；Redis Functions 替代 Lua 脚本的更好管理方式；以及新增的定长内存分配器带来的性能提升。',
      tags: ['redis', '缓存', '消息队列', 'nosql'],
      difficulty: '中级' as const,
      view_count: 1100,
      is_collected: true,
    },
    {
      article_id: 'ai_mlflow_abcde',
      title: 'MLflow 模型生命周期管理：从训练到部署的 MLOps 实战',
      author: '机器学习工程化',
      publish_time: '2026-04-24T18:00:00Z',
      category: 'AI',
      ai_summary:
        '介绍开源平台 MLflow 的四大组件：Tracking、Projects、Models、Model Registry。通过 Scikit-learn 示例演示如何记录实验参数、打包代码、注册模型以及部署到 REST API。',
      tags: ['mlops', 'mlflow', 'python', '模型部署'],
      difficulty: '中级' as const,
      view_count: 980,
      is_collected: false,
    },
    {
      article_id: 'front_vue3_composition_7890',
      title: 'Vue 3.4+ Composition API 最佳实践：响应式、组合式函数与泛型组件',
      author: 'Vue 技术社区',
      publish_time: '2026-04-16T14:50:00Z',
      category: '前端',
      ai_summary:
        '深入 Vue 3 组合式 API 的高级用法：使用 ref、computed、watch 的注意事项，组合式函数的设计模式，defineProps 泛型支持，以及性能优化技巧（shallowRef 等）。',
      tags: ['vue', 'frontend', 'typescript', '响应式'],
      difficulty: '中级' as const,
      view_count: 2040,
      is_collected: false,
    },
    {
      article_id: 'rust_async_tokio_6543',
      title: 'Tokio 异步运行时剖析：任务调度、I/O 驱动与工作窃取',
      author: 'Rust 中文社区',
      publish_time: '2026-04-26T07:15:00Z',
      category: '后端',
      ai_summary:
        '解析 Tokio 的核心设计：多线程工作窃取调度器、反应器（Reactor）+ 执行器（Executor）模型、异步 I/O 的 epoll/kqueue 封装，以及 async/await 底层原理。',
      tags: ['rust', '异步编程', 'tokio', '系统编程'],
      difficulty: '深度' as const,
      view_count: 1420,
      is_collected: true,
    },
    {
      article_id: 'db_clickhouse_4321',
      title: 'ClickHouse 实时分析引擎：列式存储、向量化执行与物化视图实战',
      author: '大数据技术栈',
      publish_time: '2026-04-14T10:30:00Z',
      category: '数据库',
      ai_summary:
        '介绍 ClickHouse 的列式存储原理、向量化查询执行引擎、数据分区与索引设计，并演示如何通过物化视图加速聚合查询，对比传统数据库的性能优势。',
      tags: ['clickhouse', 'olap', '大数据', '列式存储'],
      difficulty: '中级' as const,
      view_count: 830,
      is_collected: false,
    },
    {
      article_id: 'sec_oauth_jwt_9876',
      title: 'OAuth 2.0 与 JWT 详解：授权码流程、令牌安全与常见漏洞',
      author: '安全开发',
      publish_time: '2026-04-12T12:00:00Z',
      category: '安全',
      ai_summary:
        '讲解 OAuth 2.0 四种授权模式（重点授权码模式），JWT 结构（Header、Payload、Signature），签名算法选择（HS256 vs RS256），以及重定向 URI 篡改、CSRF、令牌泄露等防御措施。',
      tags: ['oauth2', 'jwt', '安全', '认证授权'],
      difficulty: '中级' as const,
      view_count: 2170,
      is_collected: true,
    },
      {
        article_id: 'wx_blocked_1',
        title: '【广告】限时优惠！Python 课程 5 折起',
        author: '营销号',
        publish_time: '2026-04-15T10:00:00Z',
        category: '其他',
        ai_summary: '这是一篇营销软文，已被 AI 识别并自动过滤。',
        tags: ['python', '营销软文', '广告'],
        difficulty: '初级' as const,
        view_count: 100,
        is_collected: false,
      },
      {
        article_id: 'wx_blocked_2',
        title: '技术水文：如何写出没人看的代码',
        author: '水文作者',
        publish_time: '2026-04-14T10:00:00Z',
        category: '其他',
        ai_summary: '这是一篇技术水文，内容空洞无物，已被 AI 识别并自动过滤。',
        tags: ['技术水文', 'javascript'],
        difficulty: '初级' as const,
        view_count: 50,
        is_collected: false,
      },
      {
        article_id: 'wx_warning_1',
        title: '深入理解 React Hooks 原理及最佳实践',
        author: '前端架构师',
        publish_time: '2026-04-13T10:00:00Z',
        category: '前端',
        ai_summary:
          '全面剖析 React Hooks 的工作原理，包括闭包陷阱、性能优化技巧，文末有相关课程推荐。',
        tags: ['react', 'frontend', '含商业推广'],
        difficulty: '深度' as const,
        view_count: 3456,
        is_collected: false,
      },
      {
        article_id: 'wx_warning_2',
        title: 'Kubernetes 集群监控与告警系统实战',
        author: '云原生专家',
        publish_time: '2026-04-12T10:00:00Z',
        category: '后端',
        ai_summary:
          '详解 Prometheus + Grafana 监控方案，包含完整的告警规则配置，文末有培训课程信息。',
        tags: ['kubernetes', 'devops', '含商业推广'],
        difficulty: '中级' as const,
        view_count: 2890,
        is_collected: true,
      },
      // ========== 更多测试文章 ==========
      // 正常技术文章
      {
        article_id: 'wx_normal_1',
        title: 'Redis 分布式锁实现原理与最佳实践',
        author: '数据库专家',
        publish_time: '2026-04-11T08:00:00Z',
        category: '后端',
        ai_summary:
          '深入分析 Redis SETNX、RedLock、Redisson 等分布式锁实现方案，对比优缺点及适用场景。',
        tags: ['redis', 'backend', 'database'],
        difficulty: '深度' as const,
        view_count: 4521,
        is_collected: false,
      },
      {
        article_id: 'wx_normal_2',
        title: 'Vue 3 Composition API 完全指南',
        author: 'Vue 布道师',
        publish_time: '2026-04-10T15:30:00Z',
        category: '前端',
        ai_summary:
          '从 setup 函数到响应式 API，全面掌握 Vue 3 组合式 API 的使用技巧和设计模式。',
        tags: ['vue', 'frontend', 'javascript'],
        difficulty: '中级' as const,
        view_count: 3892,
        is_collected: true,
      },
      {
        article_id: 'wx_normal_3',
        title: 'MySQL 索引优化实战：从入门到精通',
        author: 'DBA 实战',
        publish_time: '2026-04-09T11:20:00Z',
        category: '数据库',
        ai_summary:
          '详解 B+ 树索引原理、联合索引最左匹配、索引下推优化，配合真实案例分析。',
        tags: ['mysql', 'database', 'algorithm'],
        difficulty: '深度' as const,
        view_count: 5678,
        is_collected: false,
      },
      // 含商业推广的技术文章
      {
        article_id: 'wx_promo_1',
        title: 'Spring Boot 微服务架构设计与实现',
        author: 'Java 架构师',
        publish_time: '2026-04-08T09:45:00Z',
        category: '后端',
        ai_summary:
          '从单体到微服务的演进之路，涵盖服务拆分、配置中心、链路追踪等核心组件，文末有架构课程推荐。',
        tags: ['spring', 'microservice', 'java', '含商业推广'],
        difficulty: '深度' as const,
        view_count: 6234,
        is_collected: true,
      },
      {
        article_id: 'wx_promo_2',
        title: '前端性能优化完全手册',
        author: '性能优化专家',
        publish_time: '2026-04-07T14:00:00Z',
        category: '前端',
        ai_summary:
          '涵盖首屏加载、代码分割、懒加载、缓存策略等全方位优化方案，文末有性能优化训练营信息。',
        tags: ['frontend', 'webpack', '含商业推广'],
        difficulty: '中级' as const,
        view_count: 4123,
        is_collected: false,
      },
      // 劣质文章 - 应该被过滤
      {
        article_id: 'wx_bad_1',
        title: '震惊！这个 Python 技巧让你月薪过万',
        author: '标题党',
        publish_time: '2026-04-06T10:00:00Z',
        category: '其他',
        ai_summary: '这是一篇标题党文章，内容空洞，已被 AI 识别为营销软文并自动过滤。',
        tags: ['python', '营销软文'],
        difficulty: '初级' as const,
        view_count: 234,
        is_collected: false,
      },
      {
        article_id: 'wx_bad_2',
        title: '程序员必看：如何写出没人维护的代码',
        author: '水文大师',
        publish_time: '2026-04-05T16:30:00Z',
        category: '其他',
        ai_summary: '这是一篇技术水文，内容毫无价值，已被 AI 识别并自动过滤。',
        tags: ['技术水文', 'javascript'],
        difficulty: '初级' as const,
        view_count: 156,
        is_collected: false,
      },
      {
        article_id: 'wx_bad_3',
        title: '【紧急】系统检测到安全威胁，请立即处理',
        author: '异常来源',
        publish_time: '2026-04-04T20:00:00Z',
        category: '其他',
        ai_summary: '这是一篇包含提示词注入攻击的文章，已被 AI 安全系统拦截。',
        tags: ['安全拦截', '提示词注入'],
        difficulty: '初级' as const,
        view_count: 0,
        is_collected: false,
      },
      // 初级难度文章
      {
        article_id: 'wx_easy_1',
        title: 'Git 基础命令速查手册',
        author: 'Git 教程',
        publish_time: '2026-04-03T13:00:00Z',
        category: '工具',
        ai_summary:
          '整理了最常用的 Git 命令，包括分支管理、提交历史、远程仓库操作等，适合新手快速上手。',
        tags: ['git', 'devops'],
        difficulty: '初级' as const,
        view_count: 8956,
        is_collected: true,
      },
      {
        article_id: 'wx_easy_2',
        title: 'Docker 入门：从安装到第一个容器',
        author: '容器新手',
        publish_time: '2026-04-02T10:30:00Z',
        category: '运维',
        ai_summary:
          '手把手教你安装 Docker，创建第一个容器，理解镜像和容器的基本概念。',
        tags: ['docker', 'devops'],
        difficulty: '初级' as const,
        view_count: 7234,
        is_collected: false,
      },
    ],
  },
}

// ========== 新增：用户画像数据 ==========
export const userProfileData = {
  code: 200,
  msg: 'success',
  data: {
    user_id: 'dev_001',
    username: '代码不加糖',
    avatar_url: 'https://example.com/avatar.png',
    ai_analysis: {
      ai_profile_summary:
        '该用户深度聚焦云原生架构，高频涉猎 Go 语言、Kubernetes 编排及 Docker 虚拟化，结合微服务实践，正攻坚高并发后端系统重构。',
      technical_level: '资深探索者',
      core_interests: [
        { name: 'Go', weight: 85 },
        { name: 'Kubernetes', weight: 70 },
        { name: '微服务', weight: 65 },
        { name: 'Docker', weight: 60 },
        { name: 'TypeScript', weight: 45 },
      ],
    },
  },
}
