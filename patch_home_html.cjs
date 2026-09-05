const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Import Html5Outlined
code = code.replace("import { CodeOutlined", "import { Html5Outlined, CodeOutlined");

// 2. Add to features array
const newFeature = `
    {
      title: 'HTML Viewer',
      description: 'Soạn thảo và Live Preview HTML, CSS, JS ngay trên trình duyệt mà không cần Server.',
      icon: <Html5Outlined style={{ fontSize: 40, color: '#e34f26' }} />,
      link: '/html-viewer'
    },
    {
      title: 'JSON Formatter',
`;

code = code.replace(/{\s*title:\s*'JSON Formatter',/, newFeature.trim());

fs.writeFileSync('src/pages/Home.tsx', code);
