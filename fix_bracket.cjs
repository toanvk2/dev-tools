const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("{ { key: '/html-viewer'", "{ key: '/html-viewer'");
fs.writeFileSync('src/App.tsx', code);
