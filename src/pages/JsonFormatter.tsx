import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Checkbox, Segmented } from 'antd';
import Editor from '@monaco-editor/react';
import ReactJsonRaw from 'react-json-view';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const ReactJson = (ReactJsonRaw as any).default || ReactJsonRaw;
const { Title, Text } = Typography;

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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex' }}>
        <Checkbox checked={useJsEval} onChange={(e) => setUseJsEval(e.target.checked)}>
          JS Eval Mode (Cho phép Parse JS Object)
        </Checkbox>
      </div>

        <Checkbox 
          checked={useJsEval} 
          onChange={(e) => setUseJsEval(e.target.checked)}
        >
          JS Eval Mode (Cho phép Parse JS Object)
        </Checkbox>
      </div>
      
      <Row gutter={16} style={{ flex: 1, minHeight: '65vh' }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header left */}
          <div style={{ marginBottom: 8, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong>Input (Raw String)</Text>
            {error && <Text type="danger" style={{ maxWidth: 300 }} ellipsis={{ tooltip: error }}>{error}</Text>}
          </div>
          {/* Editor left */}
          <div style={{ flex: 1, border: '1px solid', borderColor: error ? '#ff4d4f' : (appTheme === 'dark' ? '#434343' : '#d9d9d9'), borderRadius: 6, overflow: 'hidden' }}>
            <Editor
              height="100%"
              defaultLanguage={useJsEval ? "javascript" : "json"}
              theme={editorTheme}
              value={input}
              onChange={(val) => setInput(val || '')}
              options={{ minimap: { enabled: false }, formatOnPaste: true }}
            />
          </div>
        </Col>
        
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header right */}
          <div style={{ marginBottom: 8, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong>Output</Text>
            <Segmented
              options={[
                { label: 'Tree View', value: 'tree' },
                { label: 'Raw Format', value: 'raw' }
              ]}
              value={viewMode}
              onChange={(val) => setViewMode(val as 'tree' | 'raw')}
            />
          </div>
          {/* Viewer right */}
          <div style={{ flex: 1, border: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9', borderRadius: 6, overflow: 'hidden', background: appTheme === 'dark' ? '#1e1e1e' : '#fff' }}>
            {viewMode === 'tree' ? (
              <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
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
                  <Text type="secondary">Chưa có dữ liệu hợp lệ</Text>
                )}
              </div>
            ) : (
              <div style={{ height: '100%' }}>
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme={editorTheme}
                  value={outputRaw}
                  options={{ readOnly: true, minimap: { enabled: false } }}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default JsonFormatter;
