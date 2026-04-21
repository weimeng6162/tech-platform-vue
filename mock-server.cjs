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
