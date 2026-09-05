import React, { useMemo } from 'react';
import { Card, Row, Col } from 'antd';
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

  const html = useMemo(() => {
    const rawMarkup = marked(mdCode || '');
    return DOMPurify.sanitize(rawMarkup as string);
  }, [mdCode]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card
            title="Markdown Editor"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0 } }}
          >
            <Editor
              height="100%"
              language="markdown"
              theme={isDark ? 'vs-dark' : 'vs'}
              value={mdCode}
              onChange={(value) => setMdCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
            />
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
