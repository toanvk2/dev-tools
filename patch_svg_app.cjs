const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import icon
code = code.replace("BgColorsOutlined } from '@ant-design/icons'", "BgColorsOutlined, PictureOutlined } from '@ant-design/icons'");

// Add React.lazy
const lazyStr = "const SvgViewer = lazy(() => import('./pages/SvgViewer'));\n";
code = code.replace("const MarkdownPreview", lazyStr + "const MarkdownPreview");

// Add to design group
const designStr = "{ key: '/svg-viewer', icon: <PictureOutlined />, label: <Link to=\"/svg-viewer\">SVG Viewer</Link> },\n                ";
code = code.replace("{ key: '/color'", designStr + "{ key: '/color'");

// Update getActiveGroup
code = code.replace("['/color', '/html-viewer']", "['/color', '/html-viewer', '/svg-viewer']");

// Add to routes
const routeStr = "<Route path=\"/svg-viewer\" element={<SvgViewer />} />\n              ";
code = code.replace("<Route path=\"/color\"", routeStr + "<Route path=\"/color\"");

// Add to getPageTitle
const titleStr = "case '/svg-viewer': return 'SVG / Vector Viewer';\n      ";
code = code.replace("case '/color'", titleStr + "case '/color'");

fs.writeFileSync('src/App.tsx', code);
