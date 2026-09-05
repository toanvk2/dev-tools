const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Move from data to design
const htmlMenuItem = "{ key: '/html-viewer', icon: <Html5Outlined />, label: <Link to=\"/html-viewer\">HTML Viewer</Link> },";
code = code.replace(htmlMenuItem, ""); // Remove from data
// Find Color Picker item and insert HTML Viewer before or after it
const colorItem = '{ key: \'/color\', label: <Link to="/color">Color Picker</Link> }';
code = code.replace(colorItem, htmlMenuItem + '\\n                ' + colorItem);

// Update getActiveGroup
code = code.replace("if (['/json-formatter', '/diff', '/html-viewer'].includes(path)) return 'data';", "if (['/json-formatter', '/diff'].includes(path)) return 'data';");
code = code.replace("if (['/color'].includes(path)) return 'design';", "if (['/color', '/html-viewer'].includes(path)) return 'design';");

fs.writeFileSync('src/App.tsx', code);
