<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
  content: string
}>()

marked.setOptions({ breaks: true, gfm: true })

const renderedContent = ref('')
let highlightReady = false

/** 异步应用高亮渲染器 */
async function applyHighlight() {
  const hljs = (await import('../utils/hljs')).default

  const renderer = new marked.Renderer()
  renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    const language = lang || ''
    try {
      const code = language && hljs.getLanguage(language)
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value
      return `<pre><code class="hljs ${language}">${code}</code></pre>`
    } catch {
      return `<pre><code class="hljs ${language}">${text}</code></pre>`
    }
  }
  marked.use({ renderer })
  highlightReady = true
  // 重新渲染当前内容（带高亮）
  renderedContent.value = marked.parse(props.content) as string
}

/** 快速渲染（无高亮） */
function renderPlain(content: string) {
  renderedContent.value = marked.parse(content) as string
}

// 初始渲染（无高亮，快速显示内容）
renderPlain(props.content)
onMounted(() => {
  applyHighlight()
})

// 内容变化时重新渲染
watch(() => props.content, (newContent) => {
  renderPlain(newContent)
  if (!highlightReady) applyHighlight()
})
</script>

<style>
.markdown-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
}

.markdown-body h1 {
  font-size: 2rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.markdown-body h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3rem;
}

.markdown-body h3 {
  font-size: 1.25rem;
}

.markdown-body h4 {
  font-size: 1.125rem;
}

.markdown-body p {
  margin: 1rem 0;
}

.markdown-body ul,
.markdown-body ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-body li {
  margin: 0.5rem 0;
}

.markdown-body a {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.markdown-body a:hover {
  border-bottom-color: var(--primary-color);
}

.markdown-body strong {
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-body em {
  font-style: italic;
}

.markdown-body blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--primary-color);
  background: var(--bg-secondary);
  border-radius: 4px;
}

.markdown-body blockquote p {
  margin: 0;
}

.markdown-body hr {
  margin: 2rem 0;
  border: none;
  border-top: 2px solid var(--border-color);
}

.markdown-body pre {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 8px;
  overflow-x: auto;
  position: relative;
}

.markdown-body pre::before {
  content: attr(data-lang);
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-size: 0.75rem;
  color: #858585;
  text-transform: uppercase;
}

.markdown-body code {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
}

.markdown-body pre code {
  color: #d4d4d4;
  display: block;
}

.markdown-body p code,
.markdown-body li code {
  padding: 0.2rem 0.4rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  color: var(--primary-color);
  font-size: 0.875em;
}

.markdown-body table {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

.markdown-body th,
.markdown-body td {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
}

.markdown-body th {
  background: var(--bg-secondary);
  font-weight: 600;
  text-align: left;
}

.markdown-body tr:nth-child(even) {
  background: var(--bg-secondary);
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

/* Highlight.js 主题覆盖 */
.hljs-comment,
.hljs-quote { color: #6a9955; }
.hljs-keyword,
.hljs-selector-tag,
.hljs-addition { color: #569cd6; }
.hljs-number,
.hljs-string,
.hljs-meta .hljs-meta-string,
.hljs-literal,
.hljs-doctag,
.hljs-regexp { color: #ce9178; }
.hljs-title,
.hljs-section,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-type { color: #4ec9b0; }
.hljs-attribute,
.hljs-name,
.hljs-variable,
.hljs-template-variable,
.hljs-class .hljs-title,
.hljs-built_in { color: #4fc1ff; }
.hljs-symbol,
.hljs-bullet,
.hljs-subst,
.hljs-meta,
.hljs-meta .hljs-keyword,
.hljs-link { color: #dcdcaa; }
.hljs-deletion { color: #f44747; }
.hljs-formula { background: #3c3c3c; }
.hljs-emphasis { font-style: italic; }
.hljs-strong { font-weight: bold; }
</style>
