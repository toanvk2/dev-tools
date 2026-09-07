import React, { useEffect, useState, useMemo } from 'react';
import { Card, Input, Typography, Table, Row, Col, Button, message, Space, Tag } from 'antd';
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

    const queryParams = useMemo(() => {
    if (!parsed) return [];
    const params: any[] = [];
    let idx = 0;
    
    parsed.searchParams.forEach((val, key) => {
      params.push({ key: idx++, paramKey: key, paramValue: val, source: 'Search' });
    });

    if (parsed.hash.includes('?')) {
      const hashQueryString = parsed.hash.substring(parsed.hash.indexOf('?'));
      const hashParams = new URLSearchParams(hashQueryString);
      hashParams.forEach((val, key) => {
        params.push({ key: idx++, paramKey: key, paramValue: val, source: 'Hash' });
      });
    }
    return params;
  }, [parsed]);

  const columns = [
    { 
      title: 'Key', 
      dataIndex: 'paramKey', 
      key: 'paramKey', 
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.source === 'Hash' && <Tag color="orange" style={{ fontSize: 10, lineHeight: '14px', border: 0 }}>Hash</Tag>}
        </Space>
      ) 
    },
    { title: 'Value', dataIndex: 'paramValue', key: 'paramValue' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title="URL Input & Details" 
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, overflowY: 'auto', padding: 24 } }}
          >
            <Text strong>Enter URL:</Text>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 24 }}>
              <TextArea 
                value={urlInput} 
                onChange={(e) => setUrlInput(e.target.value)} 
                placeholder="https://..." 
                autoSize={{ minRows: 3, maxRows: 6 }} 
                style={{ fontFamily: 'monospace', fontSize: 16 }}
              />
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(urlInput)} style={{ height: 'auto' }} />
            </div>

            {parsed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><Text strong>Protocol:</Text> <Input value={parsed.protocol} readOnly /></div>
                <div><Text strong>Host / Domain:</Text> <Input value={parsed.host} readOnly /></div>
                <div><Text strong>Port:</Text> <Input value={parsed.port || '(default)'} readOnly /></div>
                <div><Text strong>Path:</Text> <Input value={parsed.pathname} readOnly /></div>
                <div><Text strong>Hash (Fragment):</Text> <Input value={parsed.hash} readOnly /></div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <Text type="secondary">Vui lòng nhập một URL hợp lệ (bao gồm http/https)</Text>
              </div>
            )}
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title="Query Parameters" 
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, overflowY: 'auto', padding: 0 } }}
          >
            {parsed ? (
              <Table 
                dataSource={queryParams} 
                columns={columns} 
                pagination={false} 
                size="small" 
                bordered={false} 
                locale={{ emptyText: 'No query parameters' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <Text type="secondary">Chưa có Query Parameters</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UrlParser;
