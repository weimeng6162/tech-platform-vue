<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps<{
  content: string
}>()

// 配置 marked
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error(err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true,
})

// 渲染 Markdown
const renderedContent = computed(() => {
  try {
    return marked.parse(props.content) as string
  } catch (err) {
    console.error('Markdown 渲染错误:', err)
    return props.content
  }
})
</script>

<style>
/* Markdown 样式 */
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

/* 代码块样式 */
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

/* 行内代码 */
.markdown-body p code,
.markdown-body li code {
  padding: 0.2rem 0.4rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  color: var(--primary-color);
  font-size: 0.875em;
}

/* 表格样式 */
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

/* 图片样式 */
.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

/* Highlight.js 主题覆盖 */
.hljs-comment,
.hljs-quote {
  color: #6a9955;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-addition {
  color: #569cd6;
}

.hljs-number,
.hljs-string,
.hljs-meta .hljs-meta-string,
.hljs-literal,
.hljs-doctag,
.hljs-regexp {
  color: #ce9178;
}

.hljs-title,
.hljs-section,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-type {
  color: #4ec9b0;
}

.hljs-attribute,
.hljs-name,
.hljs-variable,
.hljs-template-variable,
.hljs-class .hljs-title,
.hljs-built_in {
  color: #4fc1ff;
}

.hljs-symbol,
.hljs-bullet,
.hljs-subst,
.hljs-meta,
.hljs-meta .hljs-keyword,
.hljs-selector-tag,
.hljs-link {
  color: #dcdcaa;
}

.hljs-deletion {
  color: #f44747;
}

.hljs-formula {
  background: #3c3c3c;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}
</style>
