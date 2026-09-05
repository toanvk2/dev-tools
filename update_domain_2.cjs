const fs = require('fs');
let code = fs.readFileSync('src/pages/UrlParser.tsx', 'utf8');
code = code.replace("import { useCacheState } from '../hooks/useCacheState';", "import { useCacheState } from '../hooks/useCacheState';\nimport { APP_CONFIG } from '../config';");
code = code.replace("'https://dev-tools.io/search?q=url+parser&lang=vi#results'", "\`\${APP_CONFIG.DOMAIN}#/url-parser?q=test&lang=vi#results\`");
fs.writeFileSync('src/pages/UrlParser.tsx', code);
