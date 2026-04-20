/**
 * Markdown渲染工具
 * 使用marked.js解析Markdown，highlight.js实现代码高亮
 */

import { marked } from 'marked';
import hljs from 'highlight.js';

// 配置marked选项
marked.setOptions({
  breaks: true,        // 支持GitHub风格的换行
  gfm: true           // 支持GitHub Flavored Markdown
});

// 自定义渲染器，添加代码高亮
const renderer = new marked.Renderer();

// 重写代码块渲染方法
renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  let highlightedCode: string;
  const language = lang || '';

  if (language && hljs.getLanguage(language)) {
    // 指定了语言且支持该语言，使用高亮
    try {
      highlightedCode = hljs.highlight(text, { language }).value;
    } catch (err) {
      highlightedCode = text;
    }
  } else {
    // 未指定语言或不支持，自动检测语言
    try {
      highlightedCode = hljs.highlightAuto(text).value;
    } catch (err) {
      highlightedCode = text;
    }
  }

  // 返回带高亮的HTML
  return `<pre><code class="hljs ${language}">${highlightedCode}</code></pre>`;
};

// 应用自定义渲染器
marked.use({ renderer });

/**
 * 渲染Markdown文本为HTML
 * @param content Markdown内容
 * @returns 渲染后的HTML字符串
 */
export function renderMarkdown(content: string): string {
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('[Markdown Render Error]', error);
    return content; // 渲染失败，返回原文
  }
}

/**
 * 获取代码高亮的CSS样式
 * 可在main.ts中导入
 */
export function importHighlightStyle() {
  // 使用GitHub风格的主题
  import('highlight.js/styles/github-dark.css');
}
