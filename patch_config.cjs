const fs = require('fs');
let code = fs.readFileSync('src/config.ts', 'utf8');

code = code.replace("CONTACT_EMAIL: 'admin@toanvk2.github.io'", "CONTACT_EMAIL: 'admin@toanvk2.github.io',\n  GITHUB_REPO: 'https://github.com/toanvk2/dev-tools'");

fs.writeFileSync('src/config.ts', code);
