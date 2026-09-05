const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("{ key: '/html-viewer', icon: <Html5Outlined />, label: <Link to=\"/html-viewer\">HTML Viewer</Link> },\\n                { key: '/color', label: <Link to=\"/color\">Color Picker</Link> }", "{ key: '/html-viewer', icon: <Html5Outlined />, label: <Link to=\"/html-viewer\">HTML Viewer</Link> },\n                { key: '/color', label: <Link to=\"/color\">Color Picker</Link> }");
fs.writeFileSync('src/App.tsx', code);
