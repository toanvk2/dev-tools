import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Card, InputNumber, Radio, Button, message, Divider, Input } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;

const LOREM_WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"];

const generateLorem = (type: 'paragraphs' | 'words' | 'sentences', count: number): string => {
  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  
  const generateSentence = (wordCount: number = Math.floor(Math.random() * 8) + 5) => {
    let sentence = Array.from({ length: wordCount }, getRandomWord).join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (sentenceCount: number = Math.floor(Math.random() * 4) + 3) => {
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
  };

  if (type === 'words') {
    return Array.from({ length: count }, getRandomWord).join(' ');
  } else if (type === 'sentences') {
    return Array.from({ length: count }, () => generateSentence()).join(' ');
  } else {
    // paragraphs
    let paragraphs = [];
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        // First paragraph traditionally starts with Lorem ipsum dolor sit amet
        paragraphs.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + generateParagraph(Math.floor(Math.random() * 3) + 2));
      } else {
        paragraphs.push(generateParagraph());
      }
    }
    return paragraphs.join('\n\n');
  }
};

const LoremIpsum: React.FC = () => {
  const [type, setType] = useCacheState<'paragraphs' | 'words' | 'sentences'>('lorem-type', 'paragraphs');
  const [count, setCount] = useCacheState<number>('lorem-count', 3);
  const [output, setOutput] = useState<string>('');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const handleGenerate = () => {
    setOutput(generateLorem(type, count));
  };

  // Generate on mount or when settings change significantly (debounced could be better, but explicit button is fine too)
  // Let's auto-generate when settings change
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, count]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    message.success('Đã copy văn bản!');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={8} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title="Cài đặt (Settings)"
            style={{ flex: 1 }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}><Text strong>Loại dữ liệu (Type)</Text></div>
              <Radio.Group 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="paragraphs" style={{ flex: 1, textAlign: 'center' }}>Đoạn văn</Radio.Button>
                <Radio.Button value="sentences" style={{ flex: 1, textAlign: 'center' }}>Câu</Radio.Button>
                <Radio.Button value="words" style={{ flex: 1, textAlign: 'center' }}>Từ</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}><Text strong>Số lượng (Count)</Text></div>
              <InputNumber 
                min={1} 
                max={type === 'words' ? 1000 : 100} 
                value={count} 
                onChange={(val) => setCount(val || 1)} 
                style={{ width: '100%' }}
                size="large"
              />
            </div>

            <Divider />

            <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate} block size="large" style={{ marginBottom: 12 }}>
              Tạo mới ngẫu nhiên (Regenerate)
            </Button>
            <Button icon={<CopyOutlined />} onClick={handleCopy} block size="large">
              Copy vào Clipboard
            </Button>
          </Card>
        </Col>

        <Col span={16} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title="Kết quả (Output)"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0, display: 'flex' } }}
          >
            <Input.TextArea
              style={{ 
                flex: 1, 
                resize: 'none', 
                border: 'none', 
                borderRadius: 0, 
                padding: 24, 
                fontSize: 16, 
                lineHeight: 1.6,
                background: isDark ? '#141414' : '#fff', 
                boxShadow: 'none' 
              }}
              value={output}
              readOnly
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoremIpsum;
