import React, { useMemo, useState } from 'react';
import { Card, Row, Col, Typography, message, Segmented } from 'antd';
import Editor from '@monaco-editor/react';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;

const defaultSvg = `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24.0"
    android:viewportHeight="24.0">
    <path
        android:fillColor="#FF0000"
        android:pathData="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10,-4.48 10,-10S17.52,2 12,2zM11,19.93c-3.95,-0.49 -7,-3.85 -7,-7.93 0,-0.62 0.08,-1.21 0.21,-1.79L9,15v1c0,1.1 0.9,2 2,2v1.93zM17.9,17.39c-0.26,-0.81 -1,-1.39 -1.9,-1.39h-1v-3c0,-0.55 -0.45,-1 -1,-1H8v-2h2c0.55,0 1,-0.45 1,-1V7h2c1.1,0 2,-0.9 2,-2v-0.41c2.93,1.19 5,4.06 5,7.41 0,2.08 -0.8,3.97 -2.1,5.39z"/>
</vector>`;

const SvgViewer: React.FC = () => {
  const [svgInput, setSvgInput] = useCacheState<string>('svg-viewer-input', defaultSvg);
  const [background, setBackground] = useState<string>('checkerboard');
  const [isDragging, setIsDragging] = useState(false);

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const transformAndroidToSvg = (xmlString: string) => {
    try {
      if (!xmlString.includes('<vector')) return xmlString;
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      const vector = doc.querySelector('vector');
      if (!vector) return xmlString;

      const vWidth = vector.getAttribute('android:viewportWidth') || '24';
      const vHeight = vector.getAttribute('android:viewportHeight') || '24';
      const width = vector.getAttribute('android:width')?.replace('dp', '') || vWidth;
      const height = vector.getAttribute('android:height')?.replace('dp', '') || vHeight;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vWidth} ${vHeight}" width="${width}" height="${height}">\\n`;

      const processNode = (node: Element, indent: string): string => {
        let out = '';
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (child.tagName === 'path') {
            const d = child.getAttribute('android:pathData') || '';
            const fill = child.getAttribute('android:fillColor');
            const fillType = child.getAttribute('android:fillType') === 'evenOdd' ? 'evenodd' : undefined;
            const stroke = child.getAttribute('android:strokeColor');
            const strokeWidth = child.getAttribute('android:strokeWidth');
            const strokeLineCap = child.getAttribute('android:strokeLineCap');
            const strokeLineJoin = child.getAttribute('android:strokeLineJoin');
            const fillAlpha = child.getAttribute('android:fillAlpha');
            const strokeAlpha = child.getAttribute('android:strokeAlpha');

            out += `${indent}<path d="${d}"`;
            if (fill) out += ` fill="${fill}"`;
            else if (!stroke) out += ` fill="#000000"`;
            else out += ` fill="none"`;
            
            if (fillType) out += ` fill-rule="${fillType}"`;
            if (stroke) out += ` stroke="${stroke}"`;
            if (strokeWidth) out += ` stroke-width="${strokeWidth}"`;
            if (strokeLineCap) out += ` stroke-linecap="${strokeLineCap}"`;
            if (strokeLineJoin) out += ` stroke-linejoin="${strokeLineJoin}"`;
            if (fillAlpha) out += ` fill-opacity="${fillAlpha}"`;
            if (strokeAlpha) out += ` stroke-opacity="${strokeAlpha}"`;
            out += ` />\\n`;
          } else if (child.tagName === 'group') {
            const rotation = child.getAttribute('android:rotation') || '0';
            const pivotX = child.getAttribute('android:pivotX') || '0';
            const pivotY = child.getAttribute('android:pivotY') || '0';
            const scaleX = child.getAttribute('android:scaleX') || '1';
            const scaleY = child.getAttribute('android:scaleY') || '1';
            const translateX = child.getAttribute('android:translateX') || '0';
            const translateY = child.getAttribute('android:translateY') || '0';

            let transform = '';
            if (translateX !== '0' || translateY !== '0') transform += `translate(${translateX}, ${translateY}) `;
            if (rotation !== '0') transform += `rotate(${rotation} ${pivotX} ${pivotY}) `;
            if (scaleX !== '1' || scaleY !== '1') transform += `scale(${scaleX}, ${scaleY}) `;
            
            out += `${indent}<g`;
            if (transform) out += ` transform="${transform.trim()}"`;
            out += `>\\n`;
            out += processNode(child, indent + '  ');
            out += `${indent}</g>\\n`;
          }
        }
        return out;
      };

      svg += processNode(vector, '  ');
      svg += `</svg>`;
      return svg;
    } catch (e) {
      console.error('Android Vector parsing error:', e);
      return xmlString;
    }
  };

  const previewHtml = useMemo(() => {
    if (!svgInput) return '';
    return transformAndroidToSvg(svgInput);
  }, [svgInput]);

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
          setSvgInput(content);
          message.success(`Đã tải file ${file.name}`);
        }
      };
      reader.onerror = () => message.error('Lỗi khi đọc file!');
      reader.readAsText(file);
    }
  };

  const bgStyle = background === 'checkerboard' 
    ? { backgroundImage: 'conic-gradient(#ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }
    : { backgroundColor: background };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>SVG / Android XML</span>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>Hỗ trợ kéo thả file (.svg, .xml)</Text>
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0, position: 'relative', overflow: 'hidden' } }}
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
                language="xml"
                theme={isDark ? 'vs-dark' : 'vs'}
                value={svgInput}
                onChange={(value) => setSvgInput(value || '')}
                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 16 } }}
              />
            </div>
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Live Preview</span>
                <Segmented 
                  size="small"
                  options={[
                    { label: 'Caro', value: 'checkerboard' },
                    { label: 'Sáng', value: '#ffffff' },
                    { label: 'Tối', value: '#141414' },
                  ]}
                  value={background}
                  onChange={(val) => setBackground(val as string)}
                />
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { flex: 1, padding: 0, overflow: 'hidden' } }}
          >
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 24,
                ...bgStyle 
              }}
            >
              {/* Container to scale SVG responsively but keep aspect ratio */}
              <div 
                style={{ maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                dangerouslySetInnerHTML={{ __html: previewHtml }} 
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SvgViewer;
