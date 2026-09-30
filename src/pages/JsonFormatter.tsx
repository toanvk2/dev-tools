import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Checkbox, Segmented } from 'antd';
import CodeEditor from '../components/CodeEditor';
import ToolCard from '../components/ToolCard';
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
          <ToolCard 
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
            style={{ borderColor: error ? '#ff4d4f' : undefined }}
            
          >
            <CodeEditor defaultLanguage={useJsEval ? "javascript" : "json"} value={input}
              onChange={(val) => setInput(val || '')}
              options={{ formatOnPaste: true }}
            />
          </ToolCard>
        </Col>
        
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <ToolCard 
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
            
            styles={{ body: { background: appTheme === 'dark' ? '#1e1e1e' : '#fff' } }}
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
                <CodeEditor defaultLanguage="json" value={outputRaw}
                  options={{ readOnly: true }}
                />
              </div>
            )}
          </ToolCard>
        </Col>
      </Row>
    </div>
  );
};

export default JsonFormatter;
