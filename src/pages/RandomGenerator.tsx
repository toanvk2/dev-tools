import React, { useState, useEffect } from 'react';
import { Card, Input, Typography, Segmented, Button, Slider, Checkbox, Space, InputNumber, message, Tooltip, Row, Col } from 'antd';
import { SyncOutlined, CopyOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;
const { TextArea } = Input;

const RandomGenerator: React.FC = () => {
  const [mode, setMode] = useCacheState<'uuid' | 'string'>('random-mode', 'uuid');
  
  // UUID States
  const [uuidCount, setUuidCount] = useCacheState<number>('uuid-count', 5);
  const [uuids, setUuids] = useState<string[]>([]);
  
  // String States
  const [strLength, setStrLength] = useCacheState<number>('str-len', 16);
  const [incUpper, setIncUpper] = useCacheState<boolean>('str-upper', true);
  const [incLower, setIncLower] = useCacheState<boolean>('str-lower', true);
  const [incNum, setIncNum] = useCacheState<boolean>('str-num', true);
  const [incSym, setIncSym] = useCacheState<boolean>('str-sym', true);
  const [generatedStr, setGeneratedStr] = useState<string>('');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const generateUUIDs = () => {
    const list = [];
    for (let i = 0; i < (uuidCount || 1); i++) {
      list.push(crypto.randomUUID());
    }
    setUuids(list);
  };

  const generateString = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const sym = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = '';
    if (incUpper) chars += upper;
    if (incLower) chars += lower;
    if (incNum) chars += num;
    if (incSym) chars += sym;

    if (!chars) {
      message.error('Vui lòng chọn ít nhất 1 loại ký tự!');
      return;
    }

    let result = '';
    const array = new Uint32Array(strLength);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < strLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedStr(result);
  };

  useEffect(() => {
    if (mode === 'uuid' && uuids.length === 0) generateUUIDs();
    if (mode === 'string' && !generatedStr) generateString();
  }, [mode]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã copy!');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Segmented
          size="large"
          options={[
            { label: 'UUID / GUID', value: 'uuid' },
            { label: 'Random String / Password', value: 'string' }
          ]}
          value={mode}
          onChange={(val) => setMode(val as 'uuid' | 'string')}
        />
      </div>

      <Card>
        {mode === 'uuid' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Text>Số lượng (Count):</Text>
                <InputNumber min={1} max={500} value={uuidCount} onChange={(v) => v && setUuidCount(v)} />
              </Space>
              <Button type="primary" icon={<SyncOutlined />} onClick={generateUUIDs}>
                Tạo mới (Generate)
              </Button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <TextArea 
                value={uuids.join('\n')} 
                readOnly 
                autoSize={{ minRows: 5, maxRows: 15 }} 
                style={{ fontFamily: 'monospace', fontSize: 14, padding: 16 }}
              />
              <Tooltip title="Copy tất cả">
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={() => copyToClipboard(uuids.join('\n'))}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                />
              </Tooltip>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ 
              padding: 24, 
              background: isDark ? '#141414' : '#f5f5f5', 
              border: '1px solid',
              borderColor: isDark ? '#434343' : '#d9d9d9',
              borderRadius: 8,
              position: 'relative',
              textAlign: 'center'
            }}>
              <Text style={{ fontSize: 28, fontFamily: 'monospace', letterSpacing: 2 }}>{generatedStr}</Text>
              <Tooltip title="Copy">
                <Button 
                  icon={<CopyOutlined />} 
                  size="large"
                  type="text"
                  onClick={() => copyToClipboard(generatedStr)}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                />
              </Tooltip>
            </div>

            <Row gutter={24} align="middle">
              <Col span={4}><Text strong>Độ dài (Length):</Text></Col>
              <Col span={16}>
                <Slider min={4} max={128} value={strLength} onChange={setStrLength} />
              </Col>
              <Col span={4}>
                <InputNumber min={4} max={128} value={strLength} onChange={(v) => v && setStrLength(v)} style={{ width: '100%' }} />
              </Col>
            </Row>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Checkbox checked={incUpper} onChange={(e) => setIncUpper(e.target.checked)}>A-Z (Uppercase)</Checkbox>
              <Checkbox checked={incLower} onChange={(e) => setIncLower(e.target.checked)}>a-z (Lowercase)</Checkbox>
              <Checkbox checked={incNum} onChange={(e) => setIncNum(e.target.checked)}>0-9 (Numbers)</Checkbox>
              <Checkbox checked={incSym} onChange={(e) => setIncSym(e.target.checked)}>!@#$... (Symbols)</Checkbox>
            </div>

            <Button type="primary" size="large" icon={<SyncOutlined />} onClick={generateString} block>
              Tạo Password Mới (Generate)
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RandomGenerator;
