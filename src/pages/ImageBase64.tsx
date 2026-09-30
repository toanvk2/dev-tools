import React, { useMemo } from 'react';
import { Row, Col, Typography, Input, Card, Segmented, Button, message, Space, Upload } from 'antd';
import { CopyOutlined, DeleteOutlined, InboxOutlined, DownloadOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';
import type { UploadProps } from 'antd';

const { Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const ImageBase64: React.FC = () => {
  const [mode, setMode] = useCacheState<'img2base64' | 'base642img'>('img-base64-mode', 'img2base64');
  const [base64Output, setBase64Output] = useCacheState<string>('img-base64-output', '');
  const [base64Input, setBase64Input] = useCacheState<string>('img-base64-input', '');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const handleClear = () => {
    if (mode === 'img2base64') {
      setBase64Output('');
    } else {
      setBase64Input('');
    }
  };

  const handleCopy = () => {
    if (!base64Output) return;
    navigator.clipboard.writeText(base64Output);
    message.success('Đã copy chuỗi Base64!');
  };

  const draggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên file hình ảnh (PNG, JPG, SVG, v.v...)!');
        return Upload.LIST_IGNORE;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setBase64Output(result);
          message.success(`Đã chuyển đổi ${file.name} thành Base64`);
        }
      };
      reader.readAsDataURL(file);
      return false; // Prevent automatic upload
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleDownload = () => {
    if (!base64Input) return;
    try {
      // Create a link and click it to download
      const a = document.createElement('a');
      
      // Check if it already has data URI prefix
      let href = base64Input.trim();
      if (!href.startsWith('data:image')) {
        // Fallback to png if prefix missing
        href = `data:image/png;base64,${href}`;
      }
      
      a.href = href;
      a.download = 'downloaded_image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      message.error('Không thể tải xuống hình ảnh, chuỗi Base64 có thể bị lỗi.');
    }
  };

  // Safe image src for preview
  const previewSrc = useMemo(() => {
    if (!base64Input) return '';
    const trimmed = base64Input.trim();
    if (trimmed.startsWith('data:image') || trimmed.startsWith('blob:')) {
      return trimmed;
    }
    // If user pastes raw base64 without prefix
    return `data:image/png;base64,${trimmed}`;
  }, [base64Input]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Segmented
          options={[
            { label: 'Image to Base64', value: 'img2base64' },
            { label: 'Base64 to Image', value: 'base642img' }
          ]}
          value={mode}
          onChange={(val) => setMode(val as 'img2base64' | 'base642img')}
        />
        <Space>
          <Button icon={<DeleteOutlined />} onClick={handleClear}>Xóa</Button>
          {mode === 'img2base64' && (
            <Button type="primary" icon={<CopyOutlined />} onClick={handleCopy} disabled={!base64Output}>Copy Base64</Button>
          )}
          {mode === 'base642img' && (
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} disabled={!base64Input}>Tải ảnh xuống</Button>
          )}
        </Space>
      </div>

      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title={mode === 'img2base64' ? 'Tải ảnh lên' : 'Nhập chuỗi Base64'}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ body: { flex: 1, padding: mode === 'img2base64' ? 16 : 0, display: 'flex' } }}
          >
            {mode === 'img2base64' ? (
              <Dragger {...draggerProps} style={{ width: '100%', padding: 40, background: isDark ? '#141414' : '#fafafa' }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Nhấp hoặc kéo thả file hình ảnh vào khu vực này</p>
                <p className="ant-upload-hint">
                  Hỗ trợ kéo thả trực tiếp file PNG, JPG, GIF, WebP, SVG... Ảnh sẽ được tự động chuyển sang mã Base64.
                </p>
              </Dragger>
            ) : (
              <TextArea
                style={{ flex: 1, resize: 'none', border: 'none', borderRadius: 0, padding: 16, fontSize: 14, fontFamily: 'monospace', boxShadow: 'none' }}
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Dán chuỗi Base64 (vd: data:image/png;base64,iVBORw0KGgo...) vào đây..."
              />
            )}
          </Card>
        </Col>

        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title={mode === 'img2base64' ? 'Chuỗi Base64 Output' : 'Ảnh Preview'}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ body: { flex: 1, padding: 0, display: 'flex' } }}
          >
            {mode === 'img2base64' ? (
              <TextArea
                style={{ flex: 1, resize: 'none', border: 'none', borderRadius: 0, padding: 16, fontSize: 14, fontFamily: 'monospace', background: isDark ? '#141414' : '#f5f5f5', boxShadow: 'none' }}
                value={base64Output}
                readOnly
                placeholder="Chuỗi Base64 của ảnh sẽ hiển thị ở đây..."
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: isDark ? '#141414' : '#f0f2f5', overflow: 'hidden' }}>
                {base64Input ? (
                  <img 
                    src={previewSrc} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 8 }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      message.error('Ảnh bị lỗi hoặc chuỗi Base64 không hợp lệ!');
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = 'block';
                    }}
                  />
                ) : (
                  <Text type="secondary">Ảnh preview sẽ hiển thị ở đây</Text>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImageBase64;
