import React from "react";
import { useCacheState } from "../hooks/useCacheState";
import { Row, Col, Typography, Input, Tag } from 'antd';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import { Base64 } from 'js-base64';

const { Title, Text } = Typography;
const { TextArea } = Input;

const JwtParser: React.FC = () => {
  const [jwt, setJwt] = useCacheState<string>('jwt-input', '');
  const appTheme = useAppStore(state => state.theme);
  const editorTheme = appTheme === 'dark' ? 'vs-dark' : 'light';

  let header = '';
  let payload = '';
  let signature = '';

  if (jwt) {
    try {
      const parts = jwt.split('.');
      if (parts.length === 3) {
        header = JSON.stringify(JSON.parse(Base64.decode(parts[0])), null, 2);
        payload = JSON.stringify(JSON.parse(Base64.decode(parts[1])), null, 2);
        signature = parts[2];
      }
    } catch (e) {
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={3}>JWT Parser</Title>
      <div style={{ marginBottom: 16 }}>
        <Text>Phân tích cú pháp và giải mã JSON Web Token cục bộ, không gửi dữ liệu ra ngoài.</Text>
      </div>

      <Row gutter={16} style={{ flex: 1, minHeight: '65vh' }}>
        <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ marginBottom: 8 }}>Encoded JWT</Text>
          <TextArea
            style={{ flex: 1, resize: 'none', fontFamily: 'monospace', fontSize: 16 }}
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            placeholder="Paste chuỗi JWT vào đây..."
          />
        </Col>

        <Col span={14} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ marginBottom: 8, color: '#eb2f96' }}>
              Header <Tag color="magenta" style={{ marginLeft: 8 }}>Algorithm & Token Type</Tag>
            </Text>
            <div style={{ flex: 1, border: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                theme={editorTheme}
                value={header || '{\n\n}'}
                options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: 'off' }}
              />
            </div>
          </div>

          <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ marginBottom: 8, color: '#722ed1' }}>
              Payload <Tag color="purple" style={{ marginLeft: 8 }}>Data</Tag>
            </Text>
            <div style={{ flex: 1, border: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                theme={editorTheme}
                value={payload || '{\n\n}'}
                options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: 'off' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ marginBottom: 8, color: '#13c2c2' }}>
              Signature
            </Text>
            <div style={{ 
              padding: 12, 
              background: appTheme === 'dark' ? '#141414' : '#f5f5f5', 
              border: '1px solid', 
              borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9',
              borderRadius: 6,
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              minHeight: 60
            }}>
              {signature || 'Chữ ký sẽ hiển thị ở đây'}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default JwtParser;
