const fs = require('fs');
let code = fs.readFileSync('src/pages/RegexTester.tsx', 'utf8');
code = code.replace("import { useAppStore } from '../store/useAppStore';", "import { useAppStore } from '../store/useAppStore';\nimport { APP_CONFIG } from '../config';");
code = code.replace("'Liên hệ với tôi qua email test@example.com hoặc admin@dev-tools.io nhé!\\n\\nEmail sai: wrong@email'", "\`Liên hệ với tôi qua email test@example.com hoặc \${APP_CONFIG.CONTACT_EMAIL} nhé!\\n\\nEmail sai: wrong@email\`");
fs.writeFileSync('src/pages/RegexTester.tsx', code);
