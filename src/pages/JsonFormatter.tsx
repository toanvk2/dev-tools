import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Checkbox, Segmented, Card } from 'antd';
import Editor from '@monaco-editor/react';
import ReactJsonRaw from 'react-json-view';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const ReactJson = (ReactJsonRaw as any).default || ReactJsonRaw;
const { Text } = Typography;

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useCacheState<string>('json-input', '');
  const [useJsEval, setUseJsEval] = useCacheState<boolean>('json-useJsEval', false);
  const [viewMode, setViewMode] = useCacheState<'tree' | 'raw'>('json-view-mode', 'tree');
  
  const [parsedData, setParsedData] = useState<any>(null);
  const [outputRaw, setOutputRaw] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const appTheme = useAppStore(state => state.theme);
  const editorTheme = appTheme === 'dark' ? 'vs-dark' : 'light';

  useEffect(() => {
    if (!input.trim()) {
      setParsedData(null);
      setOutputRaw('');
      setError('');
      return;
    }

    try {
      let data;
      if (useJsEval) {
        // eslint-disable-next-line no-new-func
        data = new Function('return ' + input.trim())();
      } else {
        data = JSON.parse(input);
      }
      setParsedData(data);
      setOutputRaw(JSON.stringify(data, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message || 'Lỗi cú pháp!');
    }
  }, [input, useJsEval]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      
      
      <Row gutter={24} style={{ flex: 1, minHeight: 0, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Text strong>Input (Raw String)</Text>
                  <Checkbox checked={useJsEval} onChange={(e) => setUseJsEval(e.target.checked)}>
                    JS Eval Mode
                  </Checkbox>
                </div>
                {error && <Text type="danger" style={{ maxWidth: 200, fontWeight: 'normal', fontSize: 12 }} ellipsis={{ tooltip: error }}>{error}</Text>}
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column', borderColor: error ? '#ff4d4f' : undefined }}
            styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
          >
            <Editor
              height="100%"
              defaultLanguage={useJsEval ? "javascript" : "json"}
              theme={editorTheme}
              value={input}
              onChange={(val) => setInput(val || '')}
              options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, minimap: { enabled: false }, formatOnPaste: true, wordWrap: 'wordWrapColumn', wordWrapColumn: 200, scrollBeyondLastLine: false, padding: { top: 16 } }}
            />
          </Card>
        </Col>
        
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text strong>Output</Text>
                <Segmented
                  options={[
                    { label: 'Tree View', value: 'tree' },
                    { label: 'Raw Format', value: 'raw' }
                  ]}
                  value={viewMode}
                  onChange={(val) => setViewMode(val as 'tree' | 'raw')}
                  size="small"
                />
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: appTheme === 'dark' ? '#1e1e1e' : '#fff' } }}
          >
            {viewMode === 'tree' ? (
              <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
                {parsedData !== null ? (
                  <ReactJson 
                    src={parsedData} 
                    theme={appTheme === 'dark' ? 'monokai' : 'rjv-default'}
                    displayDataTypes={false}
                    enableClipboard={true}
                    displayObjectSize={true}
                    collapsed={2}
                    style={{ backgroundColor: 'transparent' }}
                  />
                ) : (
                  <Text type="secondary" style={{ padding: 16 }}>Chưa có dữ liệu hợp lệ</Text>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex' }}>
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme={editorTheme}
                  value={outputRaw}
                  options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, readOnly: true, minimap: { enabled: false }, wordWrap: 'wordWrapColumn', wordWrapColumn: 200 }}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JsonFormatter;
