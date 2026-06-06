const fs = require('fs');
const path = require('path');

const filePath = 'D:\\资源\\编程\\demo1\\frontend-vue\\src\\views\\Category.vue';
const content = fs.readFileSync(filePath, 'utf8');

// 检查是否包含 BackToTop 组件
const hasBackToTop = content.includes('BackToTop');
console.log('Has BackToTop component:', hasBackToTop);

// 如果包含，查找相关代码
if (hasBackToTop) {
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('BackToTop') || line.includes('floating-buttons')) {
      console.log(`Line ${idx + 1}:`, line.trim());
    }
  });
}

// 查找 style 中的 position: fixed
const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const styleContent = styleMatch[1];
  const fixedMatches = styleContent.match(/position:\s*fixed[^;]*;/g);
  if (fixedMatches) {
    console.log('\nFound fixed positions in Category.vue:');
    fixedMatches.forEach(m => console.log(' -', m));
  }
}
