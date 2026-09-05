import React, { useRef } from 'react';
import { Row, Col, Typography, Input, Select, Segmented, Button, Card, Space } from 'antd';
import { DownloadOutlined, QrcodeOutlined, BarcodeOutlined } from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { useCacheState } from '../hooks/useCacheState';
import { APP_CONFIG } from '../config';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;
const { TextArea } = Input;

const CodeGenerator: React.FC = () => {
  const [codeType, setCodeType] = useCacheState<'qrcode' | 'barcode'>('code-type', 'qrcode');
  const [input, setInput] = useCacheState<string>('code-input', APP_CONFIG.DOMAIN);
  
  // QRCode options
  const [qrLevel, setQrLevel] = useCacheState<'L' | 'M' | 'Q' | 'H'>('code-qr-level', 'M');
  
  // Barcode options
  const [barcodeFormat, setBarcodeFormat] = useCacheState<string>('code-barcode-format', 'CODE128');

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!containerRef.current) return;
    
    // Find canvas (QRCode) or SVG (Barcode)
    const canvas = containerRef.current.querySelector('canvas');
    const svg = containerRef.current.querySelector('svg');
    
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      triggerDownload(url, 'qrcode.png');
    } else if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      triggerDownload(url, 'barcode.svg');
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Determine if barcode input is valid for the format. Most formats have strict restrictions.
  // To keep it simple, we'll try to render it and if react-barcode throws internally, we catch it 
  // actually react-barcode renders invalid text as an empty SVG with an error class sometimes.

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Segmented
          options={[
            { label: 'QR Code', value: 'qrcode', icon: <QrcodeOutlined /> },
            { label: 'Barcode', value: 'barcode', icon: <BarcodeOutlined /> }
          ]}
          value={codeType}
          onChange={(val) => setCodeType(val as 'qrcode' | 'barcode')}
        />
        
        {codeType === 'qrcode' ? (
          <Space>
            <Text>Mức sửa lỗi (Error Correction):</Text>
            <Select 
              value={qrLevel} 
              onChange={setQrLevel} 
              style={{ minWidth: 160 }}
              options={[
                { label: 'L (Thấp - 7%)', value: 'L' },
                { label: 'M (Vừa - 15%)', value: 'M' },
                { label: 'Q (Khá - 25%)', value: 'Q' },
                { label: 'H (Cao - 30%)', value: 'H' },
              ]}
            />
          </Space>
        ) : (
          <Space>
            <Text>Chuẩn Barcode:</Text>
            <Select 
              value={barcodeFormat} 
              onChange={setBarcodeFormat} 
              style={{ width: 150 }}
              options={[
                { label: 'CODE128 (Phổ biến)', value: 'CODE128' },
                { label: 'EAN13', value: 'EAN13' },
                { label: 'UPC', value: 'UPC' },
                { label: 'CODE39', value: 'CODE39' },
                { label: 'ITF14', value: 'ITF14' },
              ]}
            />
          </Space>
        )}
      </div>

      <Row gutter={24} style={{ flex: 1 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <Text strong>Nội dung (Input Data)</Text>
          </div>
          <TextArea
            style={{ 
              flex: 1, 
              resize: 'none', 
              fontSize: 16, 
              padding: 16, 
              fontFamily: 'monospace' 
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập nội dung để tạo mã..."
          />
        </Col>
        
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong>Kết quả (Output)</Text>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} disabled={!input}>
              Tải xuống
            </Button>
          </div>
          
          <Card 
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: isDark ? '#141414' : '#f0f2f5',
              borderColor: isDark ? '#434343' : '#d9d9d9',
              borderRadius: 6,
              overflow: 'auto'
            }}
            styles={{ body: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, width: '100%' } }}
          >
            {input ? (
              <div 
                ref={containerRef} 
                style={{ 
                  background: '#fff', 
                  padding: 24, 
                  borderRadius: 8, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
              >
                {codeType === 'qrcode' ? (
                  <QRCodeCanvas 
                    value={input} 
                    size={256} 
                    level={qrLevel} 
                    includeMargin={false} 
                  />
                ) : (
                  <Barcode 
                    value={input} 
                    format={barcodeFormat as any}
                    width={2}
                    height={100}
                    displayValue={true}
                    background="#ffffff"
                    lineColor="#000000"
                  />
                )}
              </div>
            ) : (
              <Text type="secondary">Vui lòng nhập nội dung để tạo mã</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CodeGenerator;
