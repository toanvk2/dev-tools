const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const htmlCardRegex = /\s*\{\s*title: 'HTML Viewer',\s*description: 'Soạn thảo và Live Preview HTML, CSS, JS ngay trên trình duyệt mà không cần Server.',\s*icon: <Html5Outlined style=\{\{ fontSize: 40, color: '#e34f26' \}\} \/>,\s*link: '\/html-viewer'\s*\},/;

const htmlCardMatch = code.match(htmlCardRegex);
if (htmlCardMatch) {
  // Remove it from the top
  code = code.replace(htmlCardMatch[0], '');
  
  // Insert it before Color Converter
  const colorCardRegex = /(\s*\{\s*title: 'Color Converter',)/;
  code = code.replace(colorCardRegex, htmlCardMatch[0] + "$1");
  fs.writeFileSync('src/pages/Home.tsx', code);
}
