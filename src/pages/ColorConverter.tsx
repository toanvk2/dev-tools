import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Card, Slider, InputNumber } from 'antd';
import { RgbaColorPicker } from 'react-colorful';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

extend([namesPlugin, cmykPlugin, hwbPlugin]);

const { Text } = Typography;

const ColorConverter: React.FC = () => {
  const [color, setColor] = useCacheState<{ r: number, g: number, b: number, a: number }>('color-picker', { r: 36, g: 181, b: 72, a: 1 });
  
  const [hexInput, setHexInput] = useState<string>('');
  const [rgbInput, setRgbInput] = useState<string>('');
  const [hslInput, setHslInput] = useState<string>('');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  // Sync inputs when picker changes
  useEffect(() => {
    const instance = colord(color);
    setHexInput(instance.toHex());
    setRgbInput(instance.toRgbString());
    setHslInput(instance.toHslString());
  }, [color]);

  // Handle Input Changes
  const handleHexChange = (val: string) => {
    setHexInput(val);
    const instance = colord(val);
    if (instance.isValid()) setColor(instance.toRgb());
  };

  const handleRgbChange = (val: string) => {
    setRgbInput(val);
    const instance = colord(val);
    if (instance.isValid()) setColor(instance.toRgb());
  };

  const handleHslChange = (val: string) => {
    setHslInput(val);
    const instance = colord(val);
    if (instance.isValid()) setColor(instance.toRgb());
  };

  const cmykStr = colord(color).toCmykString();
  const hwbStr = colord(color).toHwbString();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, justifyContent: 'center' }}>
        <Col span={20} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card 
            title="Color Picker & Converter" 
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }} 
            styles={{ 
              header: { borderBottom: '1px solid #f0f0f0' },
              body: { flex: 1, display: 'flex', flexDirection: 'column', padding: 32 }
            }}
          >
            <Row gutter={48} style={{ flex: 1 }}>
              <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <style>{`
                  .custom-picker { width: 100% !important; height: 350px !important; border-radius: 12px; }
                  .custom-picker .react-colorful__saturation { border-radius: 12px 12px 0 0; border-bottom: none; }
                  .custom-picker .react-colorful__hue, .custom-picker .react-colorful__alpha { height: 24px; border-radius: 12px; margin-top: 16px; }
                  .custom-picker .react-colorful__pointer { width: 32px; height: 32px; }
                `}</style>
                <div style={{ width: '100%', maxWidth: 400, padding: 16, background: isDark ? '#141414' : '#fff', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                  <RgbaColorPicker color={color} onChange={setColor} className="custom-picker" />
                </div>
              </Col>
              
              <Col span={12} style={{ display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ marginBottom: 8, fontSize: 16 }}>HEX:</Text>
                  <Input size="large" value={hexInput} onChange={(e) => handleHexChange(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 18 }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ marginBottom: 8, fontSize: 16 }}>RGB:</Text>
                  <Input size="large" value={rgbInput} onChange={(e) => handleRgbChange(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 18 }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ marginBottom: 8, fontSize: 16 }}>HSL:</Text>
                  <Input size="large" value={hslInput} onChange={(e) => handleHslChange(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 18 }} />
                </div>

                
                <Row align="middle" style={{ marginTop: 8 }}>
                  <Col span={6}><Text strong style={{ fontSize: 16 }}>Alpha:</Text></Col>
                  <Col span={12}>
                    <Slider 
                      min={0} max={100} 
                      value={Math.round(color.a * 100)} 
                      onChange={(val: number) => setColor({ ...color, a: val / 100 })} 
                    />
                  </Col>
                  <Col span={6} style={{ paddingLeft: 12 }}>
                    <InputNumber 
                      min={0} max={100} 
                      value={Math.round(color.a * 100)} 
                      onChange={(val: any) => val !== null && setColor({ ...color, a: val / 100 })}
                      formatter={(val: number | undefined | string) => `${val}%`}
                      parser={(val: string | undefined) => val ? parseInt(val.replace('%', ''), 10) : 0}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>

                <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                  <div style={{ flex: 1, padding: 16, background: isDark ? '#1f1f1f' : '#f5f5f5', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>CMYK</div>
                    <div style={{ fontFamily: 'monospace' }}>{cmykStr}</div>
                  </div>
                  <div style={{ flex: 1, padding: 16, background: isDark ? '#1f1f1f' : '#f5f5f5', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>HWB</div>
                    <div style={{ fontFamily: 'monospace' }}>{hwbStr}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ColorConverter;
