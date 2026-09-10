const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let totalReplaced = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('options={{') && !content.includes('verticalScrollbarSize')) {
    content = content.replace(/options=\{\{\s*/g, "options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, ");
    fs.writeFileSync(filePath, content);
    totalReplaced++;
  }
});

console.log('Replaced in ' + totalReplaced + ' files');
