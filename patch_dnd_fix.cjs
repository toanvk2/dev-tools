const fs = require('fs');
let code = fs.readFileSync('src/pages/MarkdownPreview.tsx', 'utf8');

const targetStr = `              onChange={(value) => setMdCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
            />
          </Card>`;

const replaceStr = `              onChange={(value) => setMdCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
            />
            </div>
          </Card>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/pages/MarkdownPreview.tsx', code);
