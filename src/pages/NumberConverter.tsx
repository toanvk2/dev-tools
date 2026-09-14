import React, { useState } from 'react';
import { Card, Input, Typography, message, Space, Button } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';


const { Text } = Typography;

const NumberConverter: React.FC = () => {
  // We store the decimal string as the single source of truth
  const [decVal, setDecVal] = useCacheState<string>('number-converter-val', '');
  const [error, setError] = useState<string>('');

  const handleClear = () => {
    setDecVal('');
    setError('');
  };

  const handleCopy = (text: string, name: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    message.success(`Đã copy số ${name}!`);
  };

  const updateFromBase = (val: string, base: number) => {
    if (!val.trim()) {
      setDecVal('');
      setError('');
      return;
    }
    
    // Clean up input spaces or typical prefixes (like 0x, 0b)
    let cleanVal = val.replace(/\s+/g, '');
    if (base === 16 && cleanVal.toLowerCase().startsWith('0x')) cleanVal = cleanVal.substring(2);
    if (base === 2 && cleanVal.toLowerCase().startsWith('0b')) cleanVal = cleanVal.substring(2);
    if (base === 8 && cleanVal.toLowerCase().startsWith('0o')) cleanVal = cleanVal.substring(2);

    try {
      // Validate characters depending on base
      if (base === 10 && !/^-?\d+$/.test(cleanVal)) throw new Error('Invalid Decimal');
      if (base === 16 && !/^-?[0-9A-Fa-f]+$/.test(cleanVal)) throw new Error('Invalid Hex');
      if (base === 2 && !/^-?[01]+$/.test(cleanVal)) throw new Error('Invalid Binary');
      if (base === 8 && !/^-?[0-7]+$/.test(cleanVal)) throw new Error('Invalid Octal');

      // Convert to BigInt first to avoid precision loss on large numbers, then to base 10 string
      let isNegative = false;
      if (cleanVal.startsWith('-')) {
        isNegative = true;
        cleanVal = cleanVal.substring(1);
      }

      let prefix = '';
      if (base === 16) prefix = '0x';
      if (base === 2) prefix = '0b';
      if (base === 8) prefix = '0o';

      const bigIntVal = BigInt((isNegative ? '-' : '') + prefix + cleanVal);
      setDecVal(bigIntVal.toString(10));
      setError('');
    } catch (err) {
      // Just keep old value but maybe show a subtle error outline or message
      setError(`Chuỗi không hợp lệ đối với hệ cơ số ${base}`);
    }
  };

  // Compute derived values safely
  let hex = '', bin = '', oct = '';
  try {
    if (decVal) {
      const bigIntVal = BigInt(decVal);
      hex = bigIntVal.toString(16).toUpperCase();
      bin = bigIntVal.toString(2);
      oct = bigIntVal.toString(8);
    }
  } catch (e) {
    // Ignore parse error on render
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text type="danger">{error}</Text>
        <Button icon={<DeleteOutlined />} onClick={handleClear} disabled={!decVal}>Xóa nội dung</Button>
      </div>

      <Card title="Hệ số thập phân (Decimal - Cơ số 10)" style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            size="large"
            value={decVal} 
            onChange={e => updateFromBase(e.target.value, 10)}
            placeholder="Ví dụ: 255"
            style={{ fontFamily: 'monospace', fontSize: 18 }}
            status={error.includes('10') ? 'error' : ''}
          />
          <Button size="large" icon={<CopyOutlined />} onClick={() => handleCopy(decVal, 'Thập phân')} />
        </Space.Compact>
      </Card>

      <Card title="Hệ số thập lục phân (Hexadecimal - Cơ số 16)" style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            size="large"
            value={hex} 
            onChange={e => updateFromBase(e.target.value, 16)}
            placeholder="Ví dụ: FF"
            style={{ fontFamily: 'monospace', fontSize: 18 }}
            status={error.includes('16') ? 'error' : ''}
            prefix={<Text type="secondary" style={{ marginRight: 8 }}>0x</Text>}
          />
          <Button size="large" icon={<CopyOutlined />} onClick={() => handleCopy(hex, 'Hex')} />
        </Space.Compact>
      </Card>

      <Card title="Hệ số nhị phân (Binary - Cơ số 2)" style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            size="large"
            value={bin} 
            onChange={e => updateFromBase(e.target.value, 2)}
            placeholder="Ví dụ: 11111111"
            style={{ fontFamily: 'monospace', fontSize: 18 }}
            status={error.includes('2') ? 'error' : ''}
            prefix={<Text type="secondary" style={{ marginRight: 8 }}>0b</Text>}
          />
          <Button size="large" icon={<CopyOutlined />} onClick={() => handleCopy(bin, 'Nhị phân')} />
        </Space.Compact>
      </Card>

      <Card title="Hệ số bát phân (Octal - Cơ số 8)" style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            size="large"
            value={oct} 
            onChange={e => updateFromBase(e.target.value, 8)}
            placeholder="Ví dụ: 377"
            style={{ fontFamily: 'monospace', fontSize: 18 }}
            status={error.includes('8') ? 'error' : ''}
            prefix={<Text type="secondary" style={{ marginRight: 8 }}>0o</Text>}
          />
          <Button size="large" icon={<CopyOutlined />} onClick={() => handleCopy(oct, 'Bát phân')} />
        </Space.Compact>
      </Card>
    </div>
  );
};

export default NumberConverter;
