/**
 * Markdown渲染工具
 * highlight.js 按需加载，避免冷启动时加载 912KB
 */

import { marked } from 'marked';

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true
});

let hljsModule: any = null;
let hljsLoading = false;
let rendererApplied = false;

/** 动态加载 highlight.js */
async function loadHljs() {
  if (hljsModule) return hljsModule;
  if (hljsLoading) {
    // 等待其他调用者加载完成
    return new Promise<typeof import('highlight.js')>((resolve) => {
      const check = setInterval(() => {
        if (hljsModule) { clearInterval(check); resolve(hljsModule); }
      }, 50);
    });
  }
  hljsLoading = true;
  hljsModule = (await import('./hljs')).default;
  // 动态注入样式
  await import('highlight.js/styles/github-dark.css');
  hljsLoading = false;
  return hljsModule;
}

/** 应用带高亮的自定义渲染器（只需执行一次） */
async function applyHighlightRenderer() {
  if (rendererApplied) return;
  const hljs = await loadHljs();
  const renderer = new marked.Renderer();

  renderer.code = function({ text, lang }: { text: string; lang?: string }) {
    const language = lang || '';
    try {
      const code = language && hljs.getLanguage(language)
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value;
      return `<pre><code class="hljs ${language}">${code}</code></pre>`;
    } catch {
      return `<pre><code class="hljs ${language}">${text}</code></pre>`;
    }
  };

  marked.use({ renderer });
  rendererApplied = true;
}

/**
 * 渲染Markdown文本为HTML
 * @param content Markdown内容
 * @param enableHighlight 是否启用代码高亮（默认false）
 * @returns 渲染后的HTML字符串
 */
export async function renderMarkdown(content: string, enableHighlight = false): Promise<string> {
  if (enableHighlight) {
    await applyHighlightRenderer();
  }
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('[Markdown Render Error]', error);
    return content;
  }
}

/** 同步版本（无高亮），用于不需要高亮的场景 */
export function renderMarkdownSync(content: string): string {
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('[Markdown Render Error]', error);
    return content;
  }
}

export { loadHljs };

/** 预加载 highlight.js（可在路由导航时调用） */
export function preloadHighlight() {
  loadHljs();
}
