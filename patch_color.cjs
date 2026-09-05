const fs = require('fs');
let code = fs.readFileSync('src/pages/ColorConverter.tsx', 'utf8');

// Add Slider and InputNumber imports if not there
code = code.replace("Input, Card, Space", "Input, Card, Space, Slider, InputNumber");

// Add Alpha Row in JSX
const alphaJSX = `
                <Row align="middle" style={{ marginTop: 8 }}>
                  <Col span={6}><Text strong style={{ fontSize: 16 }}>Alpha:</Text></Col>
                  <Col span={12}>
                    <Slider 
                      min={0} max={100} 
                      value={Math.round(color.a * 100)} 
                      onChange={(val) => setColor({ ...color, a: val / 100 })} 
                    />
                  </Col>
                  <Col span={6} style={{ paddingLeft: 12 }}>
                    <InputNumber 
                      min={0} max={100} 
                      value={Math.round(color.a * 100)} 
                      onChange={(val) => val !== null && setColor({ ...color, a: val / 100 })}
                      formatter={(val) => \`\${val}%\`}
                      parser={(val) => val ? parseInt(val.replace('%', ''), 10) : 0}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
`;

code = code.replace(/<div style={{ display: 'flex', gap: 16, marginTop: 16 }}>/, alphaJSX + "\n                <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>");

fs.writeFileSync('src/pages/ColorConverter.tsx', code);
