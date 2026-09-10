const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>", "");
code = code.replace("</Routes>\n            </Suspense>\n          </div>", "</Routes>\n            </Suspense>");

fs.writeFileSync('src/App.tsx', code);
