const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const missingTitles = `
      case '/html-viewer': return 'HTML Viewer';
      case '/yaml': return 'JSON ↔ YAML Converter';
      case '/regex': return 'Regex Tester';
      case '/url-parser': return 'URL Parser';
      case '/markdown': return 'Markdown Preview';
`;

code = code.replace("case '/random': return 'Random Generator (UUID/Password)';", "case '/random': return 'Random Generator (UUID/Password)';\n" + missingTitles);

fs.writeFileSync('src/App.tsx', code);
