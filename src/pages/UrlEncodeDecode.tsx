import React, { useMemo } from 'react';
import { Row, Col, Typography, Input, Card, Segmented, Button, message, Space } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;
const { TextArea } = Input;

const UrlEncodeDecode: React.FC = () => {
  const [mode, setMode] = useCacheState<'encode' | 'decode'>('url-codec-mode', 'encode');
  const [input, setInput] = useCacheState<string>('url-codec-input', '');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch (error) {
      return 'Lỗi: Đầu vào không hợp lệ để decode!';
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    message.success('Đã copy kết quả!');
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Segmented
          options={[
            { label: 'URL Encode', value: 'encode' },
            { label: 'URL Decode', value: 'decode' }
          ]}
          value={mode}
          onChange={(val) => setMode(val as 'encode' | 'decode')}
        />
        <Space>
          <Button icon={<DeleteOutlined />} onClick={handleClear}>Xóa</Button>
          <Button type="primary" icon={<CopyOutlined />} onClick={handleCopy}>Copy kết quả</Button>
        </Space>
      </div>

      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Nội dung gốc ({mode === 'encode' ? 'Cần Encode' : 'Cần Decode'})</Text>
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0, display: 'flex' } }}
          >
            <TextArea
              style={{ flex: 1, resize: 'none', border: 'none', borderRadius: 0, padding: 16, fontSize: 16, fontFamily: 'monospace', boxShadow: 'none', background: 'transparent' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Nhập URL, tham số hoặc chuỗi văn bản cần mã hóa...' : 'Nhập chuỗi đã bị mã hóa (ví dụ: %20) để giải mã...'}
            />
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text strong>Kết quả (Output)</Text>
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0, display: 'flex' } }}
          >
            <TextArea
              style={{ flex: 1, resize: 'none', border: 'none', borderRadius: 0, padding: 16, fontSize: 16, fontFamily: 'monospace', background: isDark ? '#141414' : '#f5f5f5', color: output.startsWith('Lỗi') ? '#ff4d4f' : 'inherit', boxShadow: 'none' }}
              value={output}
              readOnly
              placeholder="Kết quả sẽ hiển thị ở đây..."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UrlEncodeDecode;
