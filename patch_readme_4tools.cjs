const fs = require('fs');
let code = fs.readFileSync('README.md', 'utf8');

const newReadmeTools = `
- **JSON ↔ YAML Converter:** Convert between JSON and YAML instantly.
- **Regex Tester:** Test regular expressions against text with capture group inspection.
- **Markdown Previewer:** Write Markdown and live-preview the rendered HTML.
- **URL Parser:** Extract Protocol, Domain, Path, and Query parameters from URLs.
`;

code = code.replace("- **HTML Viewer:**", newReadmeTools.trim() + "\n- **HTML Viewer:**");
fs.writeFileSync('README.md', code);
