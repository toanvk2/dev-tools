const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import Html5Outlined
code = code.replace("import { CodeOutlined", "import { Html5Outlined, CodeOutlined");

// 2. Add React.lazy for HtmlViewer
const lazyRegex = /const RandomGenerator = lazy\(\(\) => import\('\.\/pages\/RandomGenerator'\)\);/;
code = code.replace(lazyRegex, "const RandomGenerator = lazy(() => import('./pages/RandomGenerator'));\nconst HtmlViewer = lazy(() => import('./pages/HtmlViewer'));");

// 3. Add to 'data' submenu items
const dataChildrenRegex = /key: '\/json-formatter'/;
const newHtmlMenuItem = `{ key: '/html-viewer', icon: <Html5Outlined />, label: <Link to="/html-viewer">HTML Viewer</Link> },\n                `;
code = code.replace(dataChildrenRegex, newHtmlMenuItem + "{ key: '/json-formatter'");

// 4. Update getActiveGroup mapping
const getActiveRegex = /if \(\['\/json-formatter', '\/diff'\]\.includes\(path\)\) return 'data';/;
code = code.replace(getActiveRegex, "if (['/json-formatter', '/diff', '/html-viewer'].includes(path)) return 'data';");

// 5. Add route to Routes
const routesRegex = /<Route path="\/json-formatter" element={<JsonFormatter \/>} \/>/;
code = code.replace(routesRegex, `<Route path="/html-viewer" element={<HtmlViewer />} />\n              <Route path="/json-formatter" element={<JsonFormatter />} />`);

fs.writeFileSync('src/App.tsx', code);
