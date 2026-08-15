import React, { useState } from 'react';
import { Row, Col, Typography, Button, message } from 'antd';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';

const { Title } = Typography;

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const appTheme = useAppStore(state => state.theme);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      message.success('Format JSON thành công!');
    } catch (error) {
      message.error('JSON không hợp lệ!');
    }
  };

  const editorTheme = appTheme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={3}>JSON Formatter</Title>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={formatJson}>Format JSON</Button>
      </div>
      <Row gutter={16} style={{ flex: 1, minHeight: '60vh' }}>
        <Col span={12}>
          <div style={{ border: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
            <Editor
              height="100%"
              defaultLanguage="json"
              theme={editorTheme}
              value={input}
              onChange={(val) => setInput(val || '')}
              options={{ minimap: { enabled: false }, formatOnPaste: true }}
            />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ border: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
            <Editor
              height="100%"
              defaultLanguage="json"
              theme={editorTheme}
              value={output}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default JsonFormatter;
