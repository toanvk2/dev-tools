const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Icons
code = code.replace("import { DatabaseOutlined, SafetyOutlined, AppstoreAddOutlined, ToolOutlined }", "import { DatabaseOutlined, SafetyOutlined, AppstoreAddOutlined, ToolOutlined, LinkOutlined, RetweetOutlined, FileTextOutlined }");

// 2. Add React.lazy imports
const lazyImports = `
const RegexTester = lazy(() => import('./pages/RegexTester'));
const YamlConverter = lazy(() => import('./pages/YamlConverter'));
const UrlParser = lazy(() => import('./pages/UrlParser'));
const MarkdownPreview = lazy(() => import('./pages/MarkdownPreview'));
`;
code = code.replace("const HtmlViewer = lazy(() => import('./pages/HtmlViewer'));", "const HtmlViewer = lazy(() => import('./pages/HtmlViewer'));\n" + lazyImports.trim());

// 3. Add to 'data' group (Yaml Converter & Regex Tester)
const yamlRegexMenu = `{ key: '/yaml', icon: <RetweetOutlined />, label: <Link to="/yaml">JSON ↔ YAML</Link> },\n                { key: '/regex', icon: <CodeOutlined />, label: <Link to="/regex">Regex Tester</Link> },\n                { key: '/markdown', icon: <FileTextOutlined />, label: <Link to="/markdown">Markdown Preview</Link> },\n                `;
code = code.replace("{ key: '/json-formatter', icon: <CodeOutlined />", yamlRegexMenu + "{ key: '/json-formatter', icon: <CodeOutlined />");

// 4. Add to 'time' group or create a 'Network / Util' group? 
// Let's put URL Parser in 'security' group (Crypto & Network)
const urlParserMenu = `{ key: '/url-parser', icon: <LinkOutlined />, label: <Link to="/url-parser">URL Parser</Link> },\n                `;
code = code.replace("{ key: '/encoder', icon: <SwapOutlined />", urlParserMenu + "{ key: '/encoder', icon: <SwapOutlined />");

// 5. Update getActiveGroup mapping
code = code.replace("if (['/json-formatter', '/diff'].includes(path)) return 'data';", "if (['/json-formatter', '/diff', '/yaml', '/regex', '/markdown'].includes(path)) return 'data';");
code = code.replace("if (['/encoder', '/jwt', '/hash'].includes(path)) return 'security';", "if (['/encoder', '/jwt', '/hash', '/url-parser'].includes(path)) return 'security';");

// 6. Add Routes
const routes = `
              <Route path="/yaml" element={<YamlConverter />} />
              <Route path="/regex" element={<RegexTester />} />
              <Route path="/url-parser" element={<UrlParser />} />
              <Route path="/markdown" element={<MarkdownPreview />} />
`;
code = code.replace('<Route path="/json-formatter" element={<JsonFormatter />} />', '<Route path="/json-formatter" element={<JsonFormatter />} />\n' + routes.trim());

fs.writeFileSync('src/App.tsx', code);
