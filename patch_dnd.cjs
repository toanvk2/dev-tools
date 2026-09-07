const fs = require('fs');
let code = fs.readFileSync('src/pages/MarkdownPreview.tsx', 'utf8');

// 1. Add message to antd imports
code = code.replace("import { Card, Row, Col } from 'antd';", "import { Card, Row, Col, message } from 'antd';");
code = code.replace("import { Card, Row, Col, message } from 'antd';", "import { Card, Row, Col, message, Typography } from 'antd';\nconst { Text } = Typography;");

// 2. Add drag and drop logic
const dragDropLogic = `
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
          message.success(\`Đã tải file \${file.name}\`);
        }
      };
      reader.onerror = () => {
        message.error('Lỗi khi đọc file!');
      };
      reader.readAsText(file);
    }
  };
`;

code = code.replace("const html = useMemo(() => {", dragDropLogic + "\n  const html = useMemo(() => {");

// 3. Update the Card rendering to include overlay
const cardReplacement = `
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
`;

code = code.replace(/<Card\s+title="Markdown Editor"[\s\S]+?<Editor/, cardReplacement.trim());

fs.writeFileSync('src/pages/MarkdownPreview.tsx', code);
