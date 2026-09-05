import React from 'react';
import { Card, Row, Col } from 'antd';
import Editor from '@monaco-editor/react';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';


const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      line-height: 1.5;
      color: #333;
    }
    .box {
      padding: 20px;
      background: linear-gradient(135deg, #1890ff, #722ed1);
      color: white;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>Hello, HTML Viewer! 🚀</h1>
    <p>Live preview your HTML, CSS, and JavaScript in real-time.</p>
  </div>
  <script>
    console.log("HTML Viewer initialized!");
  </script>
</body>
</html>`;

const HtmlViewer: React.FC = () => {
  const [htmlCode, setHtmlCode] = useCacheState<string>('html-viewer', defaultHtml);
  
  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title="HTML Editor" 
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ 
              header: { borderBottom: '1px solid #f0f0f0' }, 
              body: { flex: 1, padding: 0 } 
            }}
          >
            <Editor
              height="100%"
              language="html"
              theme={isDark ? 'vs-dark' : 'vs'}
              value={htmlCode}
              onChange={(value) => setHtmlCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                formatOnPaste: true,
                padding: { top: 16 }
              }}
            />
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title="Live Preview" 
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ 
              header: { borderBottom: '1px solid #f0f0f0' },
              body: { flex: 1, padding: 0, backgroundColor: '#fff' } 
            }}
          >
            <iframe
              title="HTML Preview"
              srcDoc={htmlCode}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#fff' // Always white background for standard HTML rendering
              }}
              sandbox="allow-scripts"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HtmlViewer;
