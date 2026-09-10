const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("<Layout style={{ minHeight: '100vh' }}>", "<Layout style={{ height: '100vh', overflow: 'hidden' }}>");
code = code.replace("<Sider breakpoint=\"lg\" collapsedWidth=\"0\" theme={appTheme}>", "<Sider breakpoint=\"lg\" collapsedWidth=\"0\" theme={appTheme} style={{ overflowY: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}>");
code = code.replace("style={{ background: isDark ? '#000000' : '#f5f5f5' }}", "style={{ background: isDark ? '#000000' : '#f5f5f5', display: 'flex', flexDirection: 'column' }}");
code = code.replace("<Content style={{ padding: 24, margin: 0, height: '100%', overflow: 'auto' }}>", "<Content style={{ padding: 24, margin: 0, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>");
// Remove the inner div since Content is now flex-col
code = code.replace("<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>\\n            <Suspense", "<Suspense");
// The closing div needs to be removed
code = code.replace("</Routes>\\n            </Suspense>\\n          </div>\\n        </Content>", "</Routes>\\n            </Suspense>\\n        </Content>");

fs.writeFileSync('src/App.tsx', code);
