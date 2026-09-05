const fs = require('fs');
let code = fs.readFileSync('src/pages/MarkdownPreview.tsx', 'utf8');

// Add import for APP_CONFIG
code = code.replace("import { useAppStore } from '../store/useAppStore';", "import { useAppStore } from '../store/useAppStore';\nimport { APP_CONFIG } from '../config';");

// Use APP_CONFIG in defaultMd
code = code.replace("[Visit Github](https://github.com/toanvk2/dev-tools)", "[Visit Github](${APP_CONFIG.GITHUB_REPO})");

// The defaultMd string is declared with backticks, but we need it to evaluate at runtime. Wait, `defaultMd` is declared at the top level. We can just use the literal in the string template.
fs.writeFileSync('src/pages/MarkdownPreview.tsx', code);
