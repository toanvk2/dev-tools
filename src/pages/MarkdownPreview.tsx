import React, { useMemo } from 'react';
import { Card, Row, Col, message, Typography } from 'antd';
const { Text } = Typography;
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'github-markdown-css/github-markdown.css';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';
import { APP_CONFIG } from '../config';

const defaultMd = `# Web DevTools Collection 🚀

A modern, fast, and secure collection of developer tools built with React.

## Features
- **JSON Formatter**
- **Markdown Preview**
- **Regex Tester**

### Code Example
\`\`\`javascript
function greet() {
  console.log("Hello World!");
}
greet();
\`\`\`

> "Talk is cheap. Show me the code." - Linus Torvalds

[Visit Github](${APP_CONFIG.GITHUB_REPO})`;

const MarkdownPreview: React.FC = () => {
  const [mdCode, setMdCode] = useCacheState<string>('md-preview', defaultMd);
  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setMdCode(content);
          message.success(`Đã tải file ${file.name}`);
        }
      };
      reader.onerror = () => {
        message.error('Lỗi khi đọc file!');
      };
      reader.readAsText(file);
    }
  };

  const html = useMemo(() => {
    const rawMarkup = marked(mdCode || '');
    return DOMPurify.sanitize(rawMarkup as string);
  }, [mdCode]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card
            title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Markdown Editor</span>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>Kéo thả file .md vào đây</Text>
            </div>}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0, position: 'relative' } }}
          >
            <div 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave}
              onDrop={handleDrop} 
              style={{ width: '100%', height: '100%', position: 'relative' }}
            >
              {isDragging && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: '2px dashed #1890ff',
                  zIndex: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>Thả file vào đây...</Text>
                </div>
              )}
              <Editor
              height="100%"
              language="markdown"
              theme={isDark ? 'vs-dark' : 'vs'}
              value={mdCode}
              onChange={(value) => setMdCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
            />
            </div>
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card
            title="Live Preview"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 24, overflowY: 'auto' } }}
          >
            <div
              className="markdown-body"
              style={{ background: 'transparent' }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarkdownPreview;
