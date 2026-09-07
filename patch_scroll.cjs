const fs = require('fs');
let code = fs.readFileSync('src/pages/YamlConverter.tsx', 'utf8');

const oldOptions = "options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}";
const newOptions = "options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}";

code = code.replaceAll(oldOptions, newOptions);

fs.writeFileSync('src/pages/YamlConverter.tsx', code);
