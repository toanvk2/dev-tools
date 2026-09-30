import React from 'react';
import { Row, Col, Typography, message, Button, Space } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import CodeEditor from '../components/CodeEditor';
import ToolCard from '../components/ToolCard';
import YAML from 'yaml';
import { useCacheState } from '../hooks/useCacheState';


const { Text } = Typography;

const defaultJson = `{\n  "project": "dev-tools",\n  "version": "1.0.0",\n  "features": [\n    "json",\n    "yaml"\n  ]\n}`;
const defaultYaml = `project: dev-tools\nversion: 1.0.0\nfeatures:\n  - json\n  - yaml`;

const YamlConverter: React.FC = () => {
  const [jsonCode, setJsonCode] = useCacheState<string>('yaml-conv-json', defaultJson);
  const [yamlCode, setYamlCode] = useCacheState<string>('yaml-conv-yaml', defaultYaml);
  const [_lastEdited, setLastEdited] = React.useState<'json' | 'yaml'>('json');
  
  
  

  const convertJsonToYaml = (code: string) => {
    try {
      if (!code.trim()) { setYamlCode(''); return; }
      const obj = JSON.parse(code);
      const yamlStr = YAML.stringify(obj, { indent: 2 });
      setYamlCode(yamlStr);
    } catch (e: any) {
      // Ignore intermediate syntax errors
    }
  };

  const convertYamlToJson = (code: string) => {
    try {
      if (!code.trim()) { setJsonCode(''); return; }
      const obj = YAML.parse(code);
      const jsonStr = JSON.stringify(obj, null, 2);
      setJsonCode(jsonStr);
    } catch (e: any) {
      // Ignore intermediate syntax errors
    }
  };

  const handleJsonChange = (value: string | undefined) => {
    const val = value || '';
    setJsonCode(val);
    setLastEdited('json');
    convertJsonToYaml(val);
  };

  const handleYamlChange = (value: string | undefined) => {
    const val = value || '';
    setYamlCode(val);
    setLastEdited('yaml');
    convertYamlToJson(val);
  };

  const formatJson = () => {
    try {
      const obj = JSON.parse(jsonCode);
      setJsonCode(JSON.stringify(obj, null, 2));
      message.success('JSON Formatted!');
    } catch (e) {
      message.error('Invalid JSON');
    }
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <ToolCard noPadding={true} 
            title={<Space><Text strong>JSON</Text><Button type="text" size="small" icon={<FormatPainterOutlined />} onClick={formatJson} title="Format JSON" /></Space>} 
             
            
          >
            <CodeEditor
              language="json"
              value={jsonCode}
              onChange={handleJsonChange}
              
            />
          </ToolCard>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <ToolCard noPadding={true} 
            title="YAML" 
             
            
          >
            <CodeEditor
              language="yaml"
              value={yamlCode}
              onChange={handleYamlChange}
              
            />
          </ToolCard>
        </Col>
      </Row>
    </div>
  );
};

export default YamlConverter;
