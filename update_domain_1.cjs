const fs = require('fs');
let code = fs.readFileSync('src/pages/CodeGenerator.tsx', 'utf8');
code = code.replace("import { useCacheState } from '../hooks/useCacheState';", "import { useCacheState } from '../hooks/useCacheState';\nimport { APP_CONFIG } from '../config';");
code = code.replace("'https://dev-tools.io'", "APP_CONFIG.DOMAIN");
fs.writeFileSync('src/pages/CodeGenerator.tsx', code);
