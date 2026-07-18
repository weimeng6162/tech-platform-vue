// 8大技术分类
export const techCategories = [
  {
    id: 'all',
    name: '全部',
    icon: 'Grid',
    description: '查看所有技术文章'
  },
  {
    id: 'programming-languages',
    name: '高级编程语言',
    icon: 'Code',
    description: '各语言基础教程、进阶语法、性能优化、工程实践'
  },
  {
    id: 'web-frontend',
    name: 'Web 前端技术栈',
    icon: 'Layout',
    description: '前端框架实战、工程化配置、性能优化、响应式设计'
  },
  {
    id: 'web-backend',
    name: 'Web 后端与服务端',
    icon: 'Server',
    description: '后端架构设计、接口开发、服务治理、高并发处理'
  },
  {
    id: 'database-data',
    name: '数据库与数据',
    icon: 'Database',
    description: '数据库选型、SQL优化、NoSQL应用、数据建模'
  },
  {
    id: 'computer-fundamentals',
    name: '计算机基础与核心',
    icon: 'Cpu',
    description: '基础原理讲解、底层技术剖析、系统运维、容器化'
  },
  {
    id: 'ai-machine-learning',
    name: '人工智能与机器学习',
    icon: 'Brain',
    description: '算法入门、模型训练、行业应用、前沿技术解读'
  },
  {
    id: 'security-penetration',
    name: '安全与渗透测试',
    icon: 'Shield',
    description: '安全攻防、漏洞分析、渗透测试教程、安全合规'
  },
  {
    id: 'dev-tools',
    name: '开发工具与版本控制',
    icon: 'Wrench',
    description: '开发工具使用、版本控制实践、效率工具推荐'
  },
]

// 技术标签数据 - 按8大分类组织
export const techTags = [
  // 1. 高级编程语言类
  { id: 'python', name: 'Python', color: '#3776ab', category: 'programming-languages' },
  { id: 'java', name: 'Java', color: '#ed8b00', category: 'programming-languages' },
  { id: 'c', name: 'C', color: '#a8b9cc', category: 'programming-languages' },
  { id: 'cpp', name: 'C++', color: '#00599c', category: 'programming-languages' },
  { id: 'go', name: 'Go', color: '#00add8', category: 'programming-languages' },
  { id: 'javascript', name: 'JavaScript', color: '#f7df1e', category: 'programming-languages' },
  { id: 'typescript', name: 'TypeScript', color: '#3178c6', category: 'programming-languages' },
  { id: 'rust', name: 'Rust', color: '#dea584', category: 'programming-languages' },

  // 2. Web 前端技术栈
  { id: 'html', name: 'HTML', color: '#e34f26', category: 'web-frontend' },
  { id: 'css', name: 'CSS', color: '#1572b6', category: 'web-frontend' },
  { id: 'react', name: 'React', color: '#61dafb', category: 'web-frontend' },
  { id: 'vue', name: 'Vue', color: '#42b883', category: 'web-frontend' },
  { id: 'angular', name: 'Angular', color: '#dd0031', category: 'web-frontend' },
  { id: 'nextjs', name: 'Next.js', color: '#737373', category: 'web-frontend' },
  { id: 'nuxt', name: 'Nuxt', color: '#00dc82', category: 'web-frontend' },
  { id: 'svelte', name: 'Svelte', color: '#ff3e00', category: 'web-frontend' },
  { id: 'tailwind', name: 'Tailwind', color: '#06b6d4', category: 'web-frontend' },
  { id: 'vite', name: 'Vite', color: '#646cff', category: 'web-frontend' },
  { id: 'webpack', name: 'Webpack', color: '#8dd6f9', category: 'web-frontend' },
  { id: 'npm', name: 'npm', color: '#cb3837', category: 'web-frontend' },

  // 3. Web 后端与服务端开发
  { id: 'nodejs', name: 'Node.js', color: '#339933', category: 'web-backend' },
  { id: 'spring', name: 'Spring', color: '#6db33f', category: 'web-backend' },
  { id: 'django', name: 'Django', color: '#44B78B', category: 'web-backend' },
  { id: 'flask', name: 'Flask', color: '#000000', category: 'web-backend' },
  { id: 'express', name: 'Express', color: '#68A063', category: 'web-backend' },
  { id: 'fastapi', name: 'FastAPI', color: '#009688', category: 'web-backend' },
  { id: 'microservice', name: '微服务', color: '#00c9ff', category: 'web-backend' },
  { id: 'middleware', name: '中间件', color: '#92fe9d', category: 'web-backend' },

  // 4. 数据库与数据相关
  { id: 'mysql', name: 'MySQL', color: '#4479a1', category: 'database-data' },
  { id: 'postgresql', name: 'PostgreSQL', color: '#336791', category: 'database-data' },
  { id: 'mongodb', name: 'MongoDB', color: '#47a248', category: 'database-data' },
  { id: 'redis', name: 'Redis', color: '#dc382d', category: 'database-data' },
  { id: 'sql', name: 'SQL', color: '#336791', category: 'database-data' },
  { id: 'dataanalysis', name: '数据分析', color: '#1dd1a1', category: 'database-data' },
  { id: 'datamining', name: '数据挖掘', color: '#48dbfb', category: 'database-data' },
  { id: 'database', name: '数据库', color: '#f093fb', category: 'database-data' },
  { id: 'elasticsearch', name: 'ES', color: '#fed10a', category: 'database-data' },

  // 5. 计算机基础与核心技术
  { id: 'algorithm', name: '算法', color: '#f5576c', category: 'computer-fundamentals' },
  { id: 'datastructure', name: '数据结构', color: '#4facfe', category: 'computer-fundamentals' },
  { id: 'os', name: '操作系统', color: '#667eea', category: 'computer-fundamentals' },
  { id: 'network', name: '计算机网络', color: '#764ba2', category: 'computer-fundamentals' },
  { id: 'linux', name: 'Linux', color: '#fcc624', category: 'computer-fundamentals' },
  { id: 'fullstack', name: '全栈', color: '#6e40aa', category: 'computer-fundamentals' },
  { id: 'server', name: '服务器', color: '#3498db', category: 'computer-fundamentals' },
  { id: 'docker', name: 'Docker', color: '#2496ed', category: 'computer-fundamentals' },
  { id: 'kubernetes', name: 'Kubernetes', color: '#326ce5', category: 'computer-fundamentals' },

  // 6. 人工智能与机器学习
  { id: 'ml', name: '机器学习', color: '#ff6f61', category: 'ai-machine-learning' },
  { id: 'dl', name: '深度学习', color: '#ff9a9e', category: 'ai-machine-learning' },
  { id: 'cv', name: '计算机视觉', color: '#a18cd1', category: 'ai-machine-learning' },
  { id: 'nlp', name: 'NLP', color: '#fbc2eb', category: 'ai-machine-learning' },
  { id: 'llm', name: '大模型', color: '#ff6b6b', category: 'ai-machine-learning' },
  { id: 'aigc', name: 'AIGC', color: '#feca57', category: 'ai-machine-learning' },
  { id: 'tensorflow', name: 'TensorFlow', color: '#ff6f00', category: 'ai-machine-learning' },
  { id: 'pytorch', name: 'PyTorch', color: '#ee4c2c', category: 'ai-machine-learning' },

  // 7. 安全与渗透测试
  { id: 'security', name: '网络安全', color: '#e74c3c', category: 'security-penetration' },
  { id: 'pentest', name: '渗透测试', color: '#c0392b', category: 'security-penetration' },
  { id: 'vuln', name: '漏洞', color: '#e91e63', category: 'security-penetration' },
  { id: 'devops', name: '运维', color: '#1abc9c', category: 'security-penetration' },
  { id: 'cloud', name: '云计算', color: '#9b59b6', category: 'security-penetration' },

  // 8. 通用开发工具与版本控制
  { id: 'git', name: 'Git', color: '#f05032', category: 'dev-tools' },
  { id: 'crawler', name: '爬虫', color: '#f9d423', category: 'dev-tools' },
]

// 内容分类
export const categories = [
  { id: 'all', name: '全部', icon: 'Grid' },
  { id: 'tutorial', name: '教程指南', icon: 'BookOpen' },
  { id: 'principle', name: '原理深挖', icon: 'Lightbulb' },
  { id: 'practice', name: '最佳实践', icon: 'Award' },
  { id: 'tool', name: '工具推荐', icon: 'Wrench' },
  { id: 'trend', name: '行业动态', icon: 'TrendingUp' },
  { id: 'experience', name: '经验分享', icon: 'MessageCircle' },
]
