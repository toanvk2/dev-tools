const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const designStr = "{ key: '/svg-viewer', icon: <PictureOutlined />, label: <Link to=\"/svg-viewer\">SVG Viewer</Link> },\n                  ";
code = code.replace("{key: '/color'", designStr + "{key: '/color'");
fs.writeFileSync('src/App.tsx', code);
