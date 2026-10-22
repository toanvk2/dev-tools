import React from 'react';
import { Row, Col, Select } from 'antd';
import CodeEditor from '../components/CodeEditor';
import ToolCard from '../components/ToolCard';
import YAML from 'yaml';
import { useCacheState } from '../hooks/useCacheState';
import { parseEnv, stringifyEnv } from '../utils/envConverter';

export type ConfigFormat = 'json' | 'yaml' | 'env';

const defaultJson = `{\n  "project": "dev-tools",\n  "version": "1.0.0",\n  "features": [\n    "json",\n    "yaml",\n    "env"\n  ]\n}`;
const defaultYaml = `project: dev-tools\nversion: 1.0.0\nfeatures:\n  - json\n  - yaml\n  - env`;

const formatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: '.ENV', value: 'env' },
];

const parseContent = (code: string, format: ConfigFormat): any => {
  if (!code.trim()) return null;
  switch (format) {
    case 'json':
      return JSON.parse(code);
    case 'yaml':
      return YAML.parse(code);
    case 'env':
      return parseEnv(code);
  }
};

const stringifyContent = (data: any, format: ConfigFormat): string => {
  if (data === null || data === undefined) return '';
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'yaml':
      return YAML.stringify(data, { indent: 2 });
    case 'env':
      return stringifyEnv(data);
  }
};

const getMonacoLanguage = (format: ConfigFormat): string => {
  switch (format) {
    case 'json':
      return 'json';
    case 'yaml':
      return 'yaml';
    case 'env':
      return 'ini';
  }
};

const YamlConverter: React.FC = () => {
  const [leftFormat, setLeftFormat] = useCacheState<ConfigFormat>('conv-left-format', 'json');
  const [rightFormat, setRightFormat] = useCacheState<ConfigFormat>('conv-right-format', 'yaml');

  const [leftCode, setLeftCode] = useCacheState<string>('yaml-conv-json', defaultJson);
  const [rightCode, setRightCode] = useCacheState<string>('yaml-conv-yaml', defaultYaml);

  const handleLeftChange = (value: string | undefined) => {
    const val = value || '';
    setLeftCode(val);
    try {
      if (!val.trim()) {
        setRightCode('');
        return;
      }
      const data = parseContent(val, leftFormat);
      const converted = stringifyContent(data, rightFormat);
      setRightCode(converted);
    } catch {
      // Ignore syntax errors during typing
    }
  };

  const handleRightChange = (value: string | undefined) => {
    const val = value || '';
    setRightCode(val);
    try {
      if (!val.trim()) {
        setLeftCode('');
        return;
      }
      const data = parseContent(val, rightFormat);
      const converted = stringifyContent(data, leftFormat);
      setLeftCode(converted);
    } catch {
      // Ignore syntax errors during typing
    }
  };

  const handleLeftFormatChange = (newFormat: ConfigFormat) => {
    if (newFormat === leftFormat) return;

    if (newFormat === rightFormat) {
      // Swap formats if user selects the same format as the right side
      handleSwap();
      return;
    }

    try {
      const data = parseContent(leftCode, leftFormat);
      if (data) {
        setLeftCode(stringifyContent(data, newFormat));
      }
    } catch {
      // Keep old left code if parse fails
    }
    setLeftFormat(newFormat);
  };

  const handleRightFormatChange = (newFormat: ConfigFormat) => {
    if (newFormat === rightFormat) return;

    if (newFormat === leftFormat) {
      // Swap formats if user selects the same format as the left side
      handleSwap();
      return;
    }

    try {
      const data = parseContent(leftCode, leftFormat);
      if (data) {
        setRightCode(stringifyContent(data, newFormat));
      }
    } catch {
      // Keep old right code if parse fails
    }
    setRightFormat(newFormat);
  };

  const handleSwap = () => {
    const oldLeftFormat = leftFormat;
    const oldRightFormat = rightFormat;
    const oldLeftCode = leftCode;
    const oldRightCode = rightCode;

    setLeftFormat(oldRightFormat);
    setRightFormat(oldLeftFormat);
    setLeftCode(oldRightCode);
    setRightCode(oldLeftCode);
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Row gutter={20} style={{ flex: 1, margin: 0 }}>
        {/* Left Column */}
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <ToolCard
            noPadding={true}
            title={
              <Select
                value={leftFormat}
                onChange={handleLeftFormatChange}
                options={formatOptions}
                size="small"
                style={{ width: 95 }}
              />
            }
            copyText={leftCode}
          >
            <CodeEditor
              language={getMonacoLanguage(leftFormat)}
              value={leftCode}
              onChange={handleLeftChange}
            />
          </ToolCard>
        </Col>

        {/* Right Column */}
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <ToolCard
            noPadding={true}
            title={
              <Select
                value={rightFormat}
                onChange={handleRightFormatChange}
                options={formatOptions}
                size="small"
                style={{ width: 95 }}
              />
            }
            copyText={rightCode}
          >
            <CodeEditor
              language={getMonacoLanguage(rightFormat)}
              value={rightCode}
              onChange={handleRightChange}
            />
          </ToolCard>
        </Col>
      </Row>
    </div>
  );
};

export default YamlConverter;
