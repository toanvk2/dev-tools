import React, { useState, useEffect } from 'react';
import { Card, Input, Typography, Button, Slider, Checkbox, Space, InputNumber, message, Tooltip, Row, Col, Segmented } from 'antd';
import { SyncOutlined, CopyOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;
const { TextArea } = Input;

const RandomGenerator: React.FC = () => {
  // UUID States
  const [uuidCount, setUuidCount] = useCacheState<number>('uuid-count', 5);
  const [uuids, setUuids] = useState<string[]>([]);
  
  // Custom States
  const [randomType, setRandomType] = useCacheState<'string' | 'int' | 'float'>('rand-type', 'string');
  const [generatedOutput, setGeneratedOutput] = useState<string>('');

  // String States
  const [strLength, setStrLength] = useCacheState<number>('str-len', 16);
  const [incUpper, setIncUpper] = useCacheState<boolean>('str-upper', true);
  const [incLower, setIncLower] = useCacheState<boolean>('str-lower', true);
  const [incNum, setIncNum] = useCacheState<boolean>('str-num', true);
  const [incSym, setIncSym] = useCacheState<boolean>('str-sym', true);

  // Number States
  const [intMin, setIntMin] = useCacheState<number>('rand-int-min', 1);
  const [intMax, setIntMax] = useCacheState<number>('rand-int-max', 100);
  const [floatMin, setFloatMin] = useCacheState<number>('rand-float-min', 0);
  const [floatMax, setFloatMax] = useCacheState<number>('rand-float-max', 1);
  const [floatDecimals, setFloatDecimals] = useCacheState<number>('rand-float-dec', 4);

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const generateUUIDs = () => {
    const list = [];
    for (let i = 0; i < (uuidCount || 1); i++) {
      list.push(crypto.randomUUID());
    }
    setUuids(list);
  };

  const getSecureRandomFloat = () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  };

  const generateCustom = () => {
    if (randomType === 'string') {
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
      setGeneratedOutput(result);
    } 
    else if (randomType === 'int') {
      const min = Math.ceil(intMin || 0);
      const max = Math.floor(intMax || 0);
      if (min > max) { message.error('Min không được lớn hơn Max!'); return; }
      const val = Math.floor(getSecureRandomFloat() * (max - min + 1)) + min;
      setGeneratedOutput(val.toString());
    } 
    else if (randomType === 'float') {
      const min = floatMin || 0;
      const max = floatMax || 0;
      if (min > max) { message.error('Min không được lớn hơn Max!'); return; }
      const val = getSecureRandomFloat() * (max - min) + min;
      setGeneratedOutput(val.toFixed(floatDecimals || 0));
    }
  };

  useEffect(() => {
    if (uuids.length === 0) generateUUIDs();
    if (!generatedOutput) generateCustom();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã copy!');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card title="UUID / GUID Generator" style={{ height: '100%' }} styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Text>Số lượng:</Text>
                  <InputNumber min={1} max={500} value={uuidCount} onChange={(v) => v && setUuidCount(v)} />
                </Space>
                <Button type="primary" icon={<SyncOutlined />} onClick={generateUUIDs}>
                  Generate
                </Button>
              </div>
              
              <div style={{ position: 'relative' }}>
                <TextArea 
                  value={uuids.join('\n')} 
                  readOnly 
                  autoSize={{ minRows: 15, maxRows: 25 }} 
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
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card title="Custom Random Generator" style={{ height: '100%' }} styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ 
                padding: 24, 
                background: isDark ? '#141414' : '#f5f5f5', 
                border: '1px solid',
                borderColor: isDark ? '#434343' : '#d9d9d9',
                borderRadius: 8,
                position: 'relative',
                textAlign: 'center',
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 24, fontFamily: 'monospace', wordBreak: 'break-all' }}>{generatedOutput}</Text>
                <Tooltip title="Copy">
                  <Button 
                    icon={<CopyOutlined />} 
                    type="text"
                    onClick={() => copyToClipboard(generatedOutput)}
                    style={{ position: 'absolute', top: 8, right: 8 }}
                  />
                </Tooltip>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Segmented
                  options={[
                    { label: 'String', value: 'string' },
                    { label: 'Integer', value: 'int' },
                    { label: 'Float', value: 'float' }
                  ]}
                  value={randomType}
                  onChange={(val) => setRandomType(val as 'string' | 'int' | 'float')}
                />
              </div>

              {randomType === 'string' && (
                <>
                  <Row gutter={24} align="middle">
                    <Col span={6}><Text strong>Độ dài:</Text></Col>
                    <Col span={12}>
                      <Slider min={4} max={128} value={strLength} onChange={setStrLength} />
                    </Col>
                    <Col span={6}>
                      <InputNumber min={4} max={128} value={strLength} onChange={(v) => v !== null && setStrLength(v)} style={{ width: '100%' }} />
                    </Col>
                  </Row>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Checkbox checked={incUpper} onChange={(e) => setIncUpper(e.target.checked)}>A-Z (Uppercase)</Checkbox>
                    <Checkbox checked={incLower} onChange={(e) => setIncLower(e.target.checked)}>a-z (Lowercase)</Checkbox>
                    <Checkbox checked={incNum} onChange={(e) => setIncNum(e.target.checked)}>0-9 (Numbers)</Checkbox>
                    <Checkbox checked={incSym} onChange={(e) => setIncSym(e.target.checked)}>!@#$... (Symbols)</Checkbox>
                  </div>
                </>
              )}

              {randomType === 'int' && (
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', padding: '12px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Text strong>Min:</Text>
                    <InputNumber value={intMin} onChange={(v) => v !== null && setIntMin(v)} style={{ width: 120 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Text strong>Max:</Text>
                    <InputNumber value={intMax} onChange={(v) => v !== null && setIntMax(v)} style={{ width: 120 }} />
                  </div>
                </div>
              )}

              {randomType === 'float' && (
                <div style={{ display: 'flex', gap: 24, justifyContent: 'center', padding: '12px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Text strong>Min:</Text>
                    <InputNumber value={floatMin} onChange={(v) => v !== null && setFloatMin(v)} style={{ width: 120 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Text strong>Max:</Text>
                    <InputNumber value={floatMax} onChange={(v) => v !== null && setFloatMax(v)} style={{ width: 120 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Text strong>Decimals:</Text>
                    <InputNumber min={0} max={15} value={floatDecimals} onChange={(v) => v !== null && setFloatDecimals(v)} style={{ width: 100 }} />
                  </div>
                </div>
              )}

              <Button type="primary" size="large" icon={<SyncOutlined />} onClick={generateCustom} block style={{ marginTop: 'auto' }}>
                Generate
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RandomGenerator;
