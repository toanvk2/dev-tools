const fs = require('fs');
let code = fs.readFileSync('src/pages/TimestampConverter.tsx', 'utf8');

code = code.replace(/<div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>/, `<div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>`);

const cardsRegex = /(<Card title="Timestamp to Human Date"[\s\S]+?<\/Card>)[\s\S]+?(<Card title="Human Date to Timestamp"[\s\S]+?<\/Card>)/;
const match = code.match(cardsRegex);
if (match) {
  const newCardsLayout = `
      <Row gutter={24} style={{ flex: 1 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          ${match[1].replace(/<Card/g, '<Card style={{ height: "100%" }}')}
        </Col>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          ${match[2].replace(/<Card/g, '<Card style={{ height: "100%" }}')}
        </Col>
      </Row>
  `;
  code = code.replace(cardsRegex, newCardsLayout.trim());
}

// Add Row and Col imports if missing
code = code.replace(`import { Card, Input, Typography, Space, Button, InputNumber } from 'antd';`, `import { Card, Input, Typography, Space, Button, InputNumber, Row, Col } from 'antd';`);

fs.writeFileSync('src/pages/TimestampConverter.tsx', code);
