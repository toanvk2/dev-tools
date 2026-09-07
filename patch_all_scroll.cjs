const fs = require('fs');

const files = [
  { path: 'src/pages/JsonFormatter.tsx', old: "options={{ minimap: { enabled: false }, formatOnPaste: true }}", new: "options={{ minimap: { enabled: false }, formatOnPaste: true, scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}" },
  { path: 'src/pages/DiffChecker.tsx', old: "options={{ minimap: { enabled: false } }}", new: "options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}" },
  { path: 'src/pages/RegexTester.tsx', old: "options={{ minimap: { enabled: false }, fontSize: 15, wordWrap: 'on', lineNumbers: 'off', padding: { top: 8 } }}", new: "options={{ minimap: { enabled: false }, fontSize: 15, wordWrap: 'on', lineNumbers: 'off', scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}" },
  { path: 'src/pages/MarkdownPreview.tsx', old: "options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}", new: "options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}" },
  { path: 'src/pages/TextEncoder.tsx', old: "options={{ minimap: { enabled: false }, wordWrap: 'on' }}", new: "options={{ minimap: { enabled: false }, wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}" }
];

files.forEach(f => {
  let code = fs.readFileSync(f.path, 'utf8');
  code = code.replaceAll(f.old, f.new);
  fs.writeFileSync(f.path, code);
});
