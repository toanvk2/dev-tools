import React, { useMemo } from 'react';
import { Card, Input, Typography, Row, Col, List, Tag, Alert } from 'antd';
import { useCacheState } from '../hooks/useCacheState';

const { Text, Title } = Typography;
const { TextArea } = Input;

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useCacheState<string>('regex-pattern', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useCacheState<string>('regex-flags', 'g');
  const [testString, setTestString] = useCacheState<string>('regex-test-string', 'Liên hệ với tôi qua email test@example.com hoặc admin@dev-tools.io nhé!');

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpExecArray[], error: null as string | null };
    try {
      const regex = new RegExp(pattern, flags);
      const str = testString || '';
      
      const results: RegExpExecArray[] = [];
      let match;
      if (regex.global) {
        let maxLoops = 1000;
        while ((match = regex.exec(str)) !== null && maxLoops > 0) {
          results.push(match);
          if (match.index === regex.lastIndex) regex.lastIndex++;
          maxLoops--;
        }
      } else {
        match = regex.exec(str);
        if (match) results.push(match);
      }
      return { matches: results, error: null };
    } catch (e: any) {
      return { matches: [] as RegExpExecArray[], error: String(e.message) };
    }
  }, [pattern, flags, testString]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="Regex Tester" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Text strong>Regular Expression:</Text>
            <Input 
              prefix={<Text type="secondary">/</Text>} 
              suffix={<Text type="secondary">/</Text>} 
              value={pattern} 
              onChange={(e) => setPattern(e.target.value)} 
              size="large" 
              style={{ fontFamily: 'monospace', fontSize: 18 }} 
            />
          </Col>
          <Col flex="100px">
            <Text strong>Flags:</Text>
            <Input 
              value={flags} 
              onChange={(e) => setFlags(e.target.value)} 
              size="large" 
              style={{ fontFamily: 'monospace', fontSize: 18 }} 
            />
          </Col>
        </Row>

        {error && <Alert type="error" message={error} style={{ marginBottom: 24 }} />}

        <div style={{ marginBottom: 24 }}>
          <Text strong>Test String:</Text>
          <TextArea 
            value={testString} 
            onChange={(e) => setTestString(e.target.value)} 
            autoSize={{ minRows: 4, maxRows: 10 }} 
            style={{ fontSize: 16, marginTop: 8 }} 
          />
        </div>

        <div>
          <Title level={5}>Matches ({matches.length})</Title>
          {matches.length > 0 ? (
            <List
              bordered
              dataSource={matches}
              renderItem={(m, idx) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: 4 }}>
                      <Tag color="blue">Match {idx + 1}</Tag>
                      <Text strong style={{ fontFamily: 'monospace' }}>{m[0]}</Text>
                      <Text type="secondary" style={{ marginLeft: 8 }}>Index: {m.index}</Text>
                    </div>
                    {m.length > 1 && (
                      <div style={{ marginLeft: 24, marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Capture Groups:</Text>
                        <List
                          size="small"
                          dataSource={m.slice(1)}
                          renderItem={(g: any, gIdx) => (
                            <List.Item style={{ padding: '4px 0', border: 'none' }}>
                              <Text type="secondary">Group {gIdx + 1}:</Text> <Text code>{g === undefined ? 'undefined' : String(g)}</Text>
                            </List.Item>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ padding: 24, textAlign: 'center', background: '#f5f5f5', borderRadius: 8 }}>
              <Text type="secondary">Không tìm thấy kết quả phù hợp (No matches)</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RegexTester;
