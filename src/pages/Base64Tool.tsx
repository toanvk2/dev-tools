import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Radio, message } from 'antd';
import { Base64 } from 'js-base64';

const { Title } = Typography;
const { TextArea } = Input;

const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    
    try {
      if (mode === 'encode') {
        setOutput(Base64.encode(input));
      } else {
        setOutput(Base64.decode(input));
      }
    } catch (error) {
      setOutput('Lỗi: Dữ liệu không hợp lệ!');
    }
  }, [input, mode]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={3}>Base64 Encode / Decode</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)} buttonStyle="solid">
          <Radio.Button value="encode">Mã hoá (Encode)</Radio.Button>
          <Radio.Button value="decode">Giải mã (Decode)</Radio.Button>
        </Radio.Group>
      </div>

      <Row gutter={16} style={{ flex: 1, minHeight: '60vh' }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography.Text strong style={{ marginBottom: 8 }}>
            Đầu vào (Input)
          </Typography.Text>
          <TextArea
            style={{ flex: 1, resize: 'none', fontFamily: 'monospace' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập nội dung vào đây..."
          />
        </Col>
        
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography.Text strong style={{ marginBottom: 8 }}>
            Kết quả (Output)
          </Typography.Text>
          <TextArea
            style={{ flex: 1, resize: 'none', fontFamily: 'monospace', backgroundColor: 'transparent' }}
            value={output}
            readOnly
            placeholder="Kết quả sẽ hiển thị ở đây..."
          />
        </Col>
      </Row>
    </div>
  );
};

export default Base64Tool;
