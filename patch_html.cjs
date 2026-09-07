const fs = require('fs');
let code = fs.readFileSync('src/pages/HtmlViewer.tsx', 'utf8');

const targetStr = `              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                formatOnPaste: true,
                padding: { top: 16 }
              }}`;
const replaceStr = `              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                formatOnPaste: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 }
              }}`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/HtmlViewer.tsx', code);
