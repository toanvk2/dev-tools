const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add icon
code = code.replace("BgColorsOutlined } from '@ant-design/icons'", "BgColorsOutlined, PictureOutlined } from '@ant-design/icons'");

// Add feature card
const svgCard = `
    {
      title: 'SVG Viewer',
      description: 'Xem trước file SVG và tự động chuyển đổi định dạng Android Vector Drawable (XML) sang SVG.',
      icon: <PictureOutlined style={{ fontSize: 40, color: '#f5222d' }} />,
      link: '/svg-viewer'
    },`;
code = code.replace(/\{\s*title: 'Color Converter',/, svgCard.trim() + '\n    {\n      title: \'Color Converter\',');

fs.writeFileSync('src/pages/Home.tsx', code);
