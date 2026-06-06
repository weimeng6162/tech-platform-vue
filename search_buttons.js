const fs = require('fs');
const path = require('path');

function searchFiles(dir, pattern) {
  const results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      results.push(...searchFiles(fullPath, pattern));
    } else if (file.isFile() && (file.name.endsWith('.vue') || file.name.endsWith('.ts'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (pattern.test(content)) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (pattern.test(line)) {
            results.push({
              file: fullPath.replace('D:\\资源\\编程\\demo1\\frontend-vue\\', ''),
              line: idx + 1,
              text: line.trim()
            });
          }
        });
      }
    }
  }
  
  return results;
}

const patterns = [
  /回到顶部|refresh|置顶|scrollTop|backToTop/gi,
  /fixed.*bottom.*right|position.*fixed/gi
];

patterns.forEach(pattern => {
  const results = searchFiles('D:\\资源\\编程\\demo1\\frontend-vue\\src', pattern);
  if (results.length > 0) {
    console.log(`\n=== Pattern: ${pattern.source} ===`);
    results.slice(0, 10).forEach(r => {
      console.log(`${r.file}:${r.line} - ${r.text.substring(0, 80)}`);
    });
  }
});
