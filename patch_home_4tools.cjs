const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add Icons
code = code.replace("DatabaseOutlined, SafetyOutlined", "DatabaseOutlined, SafetyOutlined, LinkOutlined, RetweetOutlined, FileTextOutlined");

// Add Cards
const newCardsData = `
    {
      title: 'JSON ↔ YAML',
      description: 'Chuyển đổi qua lại giữa định dạng JSON và YAML một cách nhanh chóng.',
      icon: <RetweetOutlined style={{ fontSize: 40, color: '#13c2c2' }} />,
      link: '/yaml'
    },
    {
      title: 'Regex Tester',
      description: 'Kiểm tra biểu thức chính quy (Regular Expression) trực quan với Highlight.',
      icon: <CodeOutlined style={{ fontSize: 40, color: '#2f54eb' }} />,
      link: '/regex'
    },
    {
      title: 'Markdown Preview',
      description: 'Soạn thảo Markdown và xem trước giao diện hiển thị ngay lập tức (Live Render).',
      icon: <FileTextOutlined style={{ fontSize: 40, color: '#fa541c' }} />,
      link: '/markdown'
    },
`;

code = code.replace(/{\s*title:\s*'JSON Formatter',/, newCardsData.trim() + '\n    {\n      title: \'JSON Formatter\',');

const urlCard = `
    {
      title: 'URL Parser',
      description: 'Phân tích Link URL thành các thành phần (Domain, Path, Query Parameters).',
      icon: <LinkOutlined style={{ fontSize: 40, color: '#eb2f96' }} />,
      link: '/url-parser'
    },
`;
code = code.replace(/{\s*title:\s*'Text Encoders \/ Decoders',/, urlCard.trim() + '\n    {\n      title: \'Text Encoders / Decoders\',');

fs.writeFileSync('src/pages/Home.tsx', code);
