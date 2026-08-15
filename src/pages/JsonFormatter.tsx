import React, { useState } from 'react';
import { Row, Col, Typography, Button, message } from 'antd';
import Editor from '@monaco-editor/react';

const { Title } = Typography;

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');

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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={3}>JSON Formatter</Title>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={formatJson}>Format JSON</Button>
      </div>
      <Row gutter={16} style={{ flex: 1, minHeight: '60vh' }}>
        <Col span={12}>
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={input}
            onChange={(val) => setInput(val || '')}
            options={{ minimap: { enabled: false }, formatOnPaste: true }}
          />
        </Col>
        <Col span={12}>
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={output}
            options={{ readOnly: true, minimap: { enabled: false } }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default JsonFormatter;
