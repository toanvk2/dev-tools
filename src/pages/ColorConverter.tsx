import React, { useState } from 'react';
import { Row, Col, Typography, Input, Card, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';

const { Text } = Typography;

const ColorConverter: React.FC = () => {
  const [colorHex, setColorHex] = useState<string>('#1890ff');
  const [colorRgb, setColorRgb] = useState<string>('rgb(24, 144, 255)');
  const [colorHsb, setColorHsb] = useState<string>('hsl(209, 100%, 55%)');

  const handleColorChange = (value: Color, hex: string) => {
    setColorHex(hex);
    setColorRgb(value.toRgbString());
    setColorHsb(value.toHsbString());
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="Color Picker & Converter" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: '24px 0' }}>
          
          {/* Big Color Picker */}
          <ColorPicker 
            value={colorHex} 
            onChange={handleColorChange} 
            showText 
            format="hex"
            style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}
          />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            <Row align="middle">
              <Col span={6}><Text strong>HEX:</Text></Col>
              <Col span={18}>
                <Input value={colorHex} readOnly style={{ fontFamily: 'monospace', fontSize: 16 }} />
              </Col>
            </Row>
            
            <Row align="middle">
              <Col span={6}><Text strong>RGB:</Text></Col>
              <Col span={18}>
                <Input value={colorRgb} readOnly style={{ fontFamily: 'monospace', fontSize: 16 }} />
              </Col>
            </Row>
            
            <Row align="middle">
              <Col span={6}><Text strong>HSB:</Text></Col>
              <Col span={18}>
                <Input value={colorHsb} readOnly style={{ fontFamily: 'monospace', fontSize: 16 }} />
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ColorConverter;
