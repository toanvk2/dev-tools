import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Select, Segmented, } from 'antd';
import CodeEditor from '../components/CodeEditor';
import ToolCard from '../components/ToolCard';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';
import { Base64 } from 'js-base64';

const { Text } = Typography;

const processData = (input: string, type: string, mode: 'encode' | 'decode') => {
  if (!input) return '';
  try {
    switch (type) {
      case 'base64':
        return mode === 'encode' ? Base64.encode(input) : Base64.decode(input);

      case 'url':
        return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);

      case 'unicode':
        if (mode === 'encode') {
          return Array.from(input).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
        } else {
          return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, grp) => String.fromCharCode(parseInt(grp, 16)));
        }

      case 'html':
        if (mode === 'encode') {
          return input.replace(/[\u00A0-\u9999<>\&"']/g, i => '&#' + i.charCodeAt(0) + ';');
        } else {
          const doc = new DOMParser().parseFromString(input, "text/html");
          return doc.documentElement.textContent || '';
        }

      case 'hex':
        if (mode === 'encode') {
          const utf8Str = unescape(encodeURIComponent(input));
          return Array.from(utf8Str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        } else {
          const cleanStr = input.replace(/[^0-9a-fA-F]/g, '');
          if (cleanStr.length % 2 !== 0) throw new Error("Chiều dài Hex không hợp lệ");
          let utf8Str = '';
          for (let i = 0; i < cleanStr.length; i += 2) {
            utf8Str += String.fromCharCode(parseInt(cleanStr.substring(i, i + 2), 16));
          }
          return decodeURIComponent(escape(utf8Str));
        }

      default:
        return input;
    }
  } catch (e: any) {
    throw new Error(e.message || 'Dữ liệu không hợp lệ!');
  }
};

const TextEncoder: React.FC = () => {
  const [input, setInput] = useCacheState<string>('encoder-input', '');
  const [type, setType] = useCacheState<string>('encoder-type', 'base64');
  const [mode, setMode] = useCacheState<'encode' | 'decode'>('encoder-mode', 'encode');

  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const appTheme = useAppStore(state => state.theme);
  

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const result = processData(input, type, mode);
      setOutput(result);
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  }, [input, type, mode]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Select
          value={type}
          onChange={(val) => setType(val)}
          style={{ width: 160 }}
          options={[
            { label: 'Base64', value: 'base64' },
            { label: 'URL', value: 'url' },
            { label: 'Unicode (\\uXXXX)', value: 'unicode' },
            { label: 'HTML Entity', value: 'html' },
            { label: 'Hex String', value: 'hex' },
          ]}
        />
        <Segmented
          options={[
            { label: 'Mã hoá (Encode)', value: 'encode' },
            { label: 'Giải mã (Decode)', value: 'decode' }
          ]}
          value={mode}
          onChange={(val) => setMode(val as 'encode' | 'decode')}
        />
      </div>


      <Row gutter={24} style={{ flex: 1, minHeight: 0, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <ToolCard noPadding={true} 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text strong>Input (Đầu vào)</Text>
                {error && <Text type="danger" ellipsis={{ tooltip: error }} style={{ maxWidth: 200, fontWeight: 'normal', fontSize: 12 }}>{error}</Text>}
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column', borderColor: error ? '#ff4d4f' : undefined }}
            styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
          >
            <CodeEditor
              defaultLanguage="text"
              value={input}
              onChange={(val) => setInput(val || '')}
              
            />
          </ToolCard>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <ToolCard noPadding={true} 
            title={<Text strong>Output (Kết quả)</Text>}
            
            styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: appTheme === 'dark' ? '#141414' : '#fafafa' } }}
          >
            <CodeEditor
              defaultLanguage="text"
              value={output}
              options={{ readOnly: true }}
            />
          </ToolCard>
        </Col>
      </Row>
    </div>
  );
};

export default TextEncoder;
