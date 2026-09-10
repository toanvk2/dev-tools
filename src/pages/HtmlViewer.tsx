import React, { useState } from 'react';
import { Card, Row, Col, Typography, message } from 'antd';
const { Text } = Typography;
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
  const [isDragging, setIsDragging] = useState(false);

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
          setHtmlCode(content);
          message.success(`Đã tải file ${file.name}`);
        }
      };
      reader.onerror = () => message.error('Lỗi khi đọc file!');
      reader.readAsText(file);
    }
  };
  
  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>HTML Editor</span>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>Hỗ trợ kéo thả file (.html, .htm)</Text>
              </div>
            } 
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ 
              header: { borderBottom: '1px solid #f0f0f0' }, 
              body: { flex: 1, padding: 0, position: 'relative', overflow: 'hidden' } 
            }}
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
                language="html"
                theme={isDark ? 'vs-dark' : 'vs'}
                value={htmlCode}
                onChange={(value) => setHtmlCode(value || '')}
                options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 }
                }}
              />
            </div>
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
