import React, { useEffect, useState } from 'react';
import { Card, Input, Typography, Table, Row, Col, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { APP_CONFIG } from '../config';

const { Text } = Typography;
const { TextArea } = Input;

const UrlParser: React.FC = () => {
  const [urlInput, setUrlInput] = useCacheState<string>('url-parser-input', `${APP_CONFIG.DOMAIN}#/url-parser?q=test&lang=vi#results`);
  const [parsed, setParsed] = useState<URL | null>(null);

  useEffect(() => {
    try {
      if (urlInput.trim()) {
        const u = new URL(urlInput.trim());
        setParsed(u);
      } else {
        setParsed(null);
      }
    } catch (e) {
      setParsed(null);
    }
  }, [urlInput]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã copy!');
  };

  const queryParams = parsed ? Array.from(parsed.searchParams.entries()).map((val, idx) => ({ key: idx, paramKey: val[0], paramValue: val[1] })) : [];

  const columns = [
    { title: 'Key', dataIndex: 'paramKey', key: 'paramKey', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Value', dataIndex: 'paramValue', key: 'paramValue' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="URL Parser" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
        <Text strong>Enter URL:</Text>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 24 }}>
          <TextArea 
            value={urlInput} 
            onChange={(e) => setUrlInput(e.target.value)} 
            placeholder="https://..." 
            autoSize={{ minRows: 2, maxRows: 6 }} 
            style={{ fontFamily: 'monospace', fontSize: 16 }}
          />
          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(urlInput)} style={{ height: 'auto' }} />
        </div>

        {parsed ? (
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><Text strong>Protocol:</Text> <Input value={parsed.protocol} readOnly /></div>
                <div><Text strong>Host / Domain:</Text> <Input value={parsed.host} readOnly /></div>
                <div><Text strong>Port:</Text> <Input value={parsed.port || '(default)'} readOnly /></div>
                <div><Text strong>Path:</Text> <Input value={parsed.pathname} readOnly /></div>
                <div><Text strong>Hash (Fragment):</Text> <Input value={parsed.hash} readOnly /></div>
              </div>
            </Col>
            <Col span={12}>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>Query Parameters:</Text>
              <Table 
                dataSource={queryParams} 
                columns={columns} 
                pagination={false} 
                size="small" 
                bordered 
                locale={{ emptyText: 'No query parameters' }}
              />
            </Col>
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            <Text type="secondary">Vui lòng nhập một URL hợp lệ (bao gồm http/https)</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UrlParser;
