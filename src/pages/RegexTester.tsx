import React, { useMemo, useRef, useEffect } from 'react';
import { Row, Col, Input, Typography, List, Tag, Collapse, Table } from 'antd';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text, Title } = Typography;

const cheatSheetData = [
  { key: '1', token: '[abc]', desc: 'A single character of: a, b, or c' },
  { key: '2', token: '[^abc]', desc: 'A character except: a, b, or c' },
  { key: '3', token: '[a-z]', desc: 'A character in the range: a-z' },
  { key: '4', token: '\\d', desc: 'A digit (0-9)' },
  { key: '5', token: '\\D', desc: 'A non-digit' },
  { key: '6', token: '\\w', desc: 'A word character (a-zA-Z0-9_)' },
  { key: '7', token: '\\W', desc: 'A non-word character' },
  { key: '8', token: '\\s', desc: 'A whitespace character' },
  { key: '9', token: '.', desc: 'Any single character' },
  { key: '10', token: '^', desc: 'Start of string / line' },
  { key: '11', token: '$', desc: 'End of string / line' },
  { key: '12', token: '(...)', desc: 'Capture group' },
  { key: '13', token: '(?:...)', desc: 'Non-capturing group' },
  { key: '14', token: 'a?', desc: 'Zero or one of a' },
  { key: '15', token: 'a*', desc: 'Zero or more of a' },
  { key: '16', token: 'a+', desc: 'One or more of a' },
  { key: '17', token: 'a{3}', desc: 'Exactly 3 of a' },
  { key: '18', token: 'a{3,}', desc: '3 or more of a' },
];

const cheatSheetColumns = [
  { title: 'Token', dataIndex: 'token', key: 'token', render: (text: string) => <Text code style={{ color: '#52c41a' }}>{text}</Text>, width: 100 },
  { title: 'Description', dataIndex: 'desc', key: 'desc', render: (text: string) => <Text type="secondary">{text}</Text> },
];

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useCacheState<string>('regex-pattern', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useCacheState<string>('regex-flags', 'gm');
  const [testString, setTestString] = useCacheState<string>('regex-test-string', 'Liên hệ với tôi qua email test@example.com hoặc admin@dev-tools.io nhé!\n\nEmail sai: wrong@email');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any>(null);
  const monaco = useMonaco();

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    decorationsRef.current = editor.createDecorationsCollection([]);
    highlightMatches();
  };

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
          if (match[0].length === 0) regex.lastIndex++; 
          results.push(match);
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

  const highlightMatches = () => {
    if (!editorRef.current || !monaco) return;
    try {
      const model = editorRef.current.getModel();
      if (!model) return;
      
      const regex = new RegExp(pattern, flags);
      const str = model.getValue();
      
      let match;
      const newDecorations: any[] = [];
      
      if (regex.global) {
        let maxLoops = 1000;
        let toggleColor = true;
        while ((match = regex.exec(str)) !== null && maxLoops > 0) {
          if (match[0].length === 0) {
            regex.lastIndex++;
          } else {
            const startPos = model.getPositionAt(match.index);
            const endPos = model.getPositionAt(match.index + match[0].length);
            newDecorations.push({
              range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
              options: { inlineClassName: toggleColor ? 'regex-match-1' : 'regex-match-2' }
            });
            toggleColor = !toggleColor;
          }
          maxLoops--;
        }
      } else {
        match = regex.exec(str);
        if (match && match[0].length > 0) {
          const startPos = model.getPositionAt(match.index);
          const endPos = model.getPositionAt(match.index + match[0].length);
          newDecorations.push({
            range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
            options: { inlineClassName: 'regex-match-1' }
          });
        }
      }
      decorationsRef.current.set(newDecorations);
    } catch (e) {
      decorationsRef.current?.set([]);
    }
  };

  useEffect(() => {
    highlightMatches();
  }, [pattern, flags, testString, monaco]);

  const panelStyle = {
    background: isDark ? '#141414' : '#fff',
    border: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .regex-match-1 { background-color: rgba(24, 144, 255, 0.4); border-radius: 2px; }
        .regex-match-2 { background-color: rgba(82, 196, 26, 0.4); border-radius: 2px; }
      `}</style>

      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={14} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 0 }}>
          
          <div style={{ ...panelStyle, padding: 16 }}>
            <Title level={5} style={{ marginTop: 0 }}>Regular Expression</Title>
            <div style={{ display: 'flex', alignItems: 'center', background: isDark ? '#1f1f1f' : '#f9f9f9', border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`, borderRadius: 6, padding: '4px 12px' }}>
              <span style={{ color: '#8c8c8c', fontSize: 18, marginRight: 8, fontWeight: 'bold' }}>/</span>
              <Input 
                bordered={false} 
                style={{ flex: 1, fontFamily: 'monospace', fontSize: 16, color: error ? '#ff4d4f' : (isDark ? '#fff' : '#000') }} 
                value={pattern} 
                onChange={(e) => setPattern(e.target.value)} 
                placeholder="insert your regular expression here"
              />
              <span style={{ color: '#8c8c8c', fontSize: 18, marginLeft: 8, marginRight: 4, fontWeight: 'bold' }}>/</span>
              <Input 
                bordered={false} 
                style={{ width: 60, fontFamily: 'monospace', fontSize: 16, color: '#52c41a' }} 
                value={flags} 
                onChange={(e) => setFlags(e.target.value)} 
                placeholder="gm"
              />
            </div>
            {error && <Text type="danger" style={{ marginTop: 8 }}>{error}</Text>}
          </div>

          <div style={{ ...panelStyle, flex: 1 }}>
            <div style={{ padding: '16px 16px 0 16px' }}>
              <Title level={5} style={{ margin: 0 }}>Test String</Title>
            </div>
            <div style={{ flex: 1, padding: '16px 0' }}>
              <Editor
                height="100%"
                language="plaintext"
                theme={isDark ? 'vs-dark' : 'vs'}
                value={testString}
                onChange={(val) => setTestString(val || '')}
                onMount={handleEditorDidMount}
                options={{ minimap: { enabled: false }, fontSize: 15, wordWrap: 'on', lineNumbers: 'off', padding: { top: 8 } }}
              />
            </div>
          </div>

        </Col>

        <Col span={10} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 0 }}>
          
          <Collapse 
            defaultActiveKey={['match-info']} 
            style={{ background: isDark ? '#141414' : '#fff' }}
            items={[
              {
                key: 'match-info',
                label: <Text strong style={{ color: '#1890ff' }}>Match Information</Text>,
                children: (
                  <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                    {matches.length > 0 ? (
                      <List
                        size="small"
                        dataSource={matches}
                        renderItem={(m, idx) => (
                          <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ width: '100%' }}>
                              <div style={{ marginBottom: 4 }}>
                                <Tag color={idx % 2 === 0 ? 'blue' : 'green'}>Match {idx + 1}</Tag>
                                <Text strong style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{m[0]}</Text>
                                <Text type="secondary" style={{ marginLeft: 8 }}>Pos: {m.index}-{m.index + m[0].length}</Text>
                              </div>
                              {m.length > 1 && (
                                <div style={{ marginLeft: 16, marginTop: 4 }}>
                                  <List
                                    size="small"
                                    split={false}
                                    dataSource={m.slice(1)}
                                    renderItem={(g: any, gIdx) => (
                                      <List.Item style={{ padding: '2px 0' }}>
                                        <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>Group {gIdx + 1}:</Text> 
                                        <Text code>{g === undefined ? 'undefined' : String(g)}</Text>
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
                      <Text type="secondary">Detailed match information will be displayed here automatically.</Text>
                    )}
                  </div>
                )
              },
              {
                key: 'quick-ref',
                label: <Text strong style={{ color: '#1890ff' }}>Quick Reference</Text>,
                children: (
                  <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                    <Table 
                      dataSource={cheatSheetData} 
                      columns={cheatSheetColumns} 
                      pagination={false} 
                      size="small" 
                      showHeader={false}
                    />
                  </div>
                )
              }
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default RegexTester;
