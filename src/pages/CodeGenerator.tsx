import React, { useRef } from 'react';
import { Row, Col, Typography, Input, Select, Segmented, Button, Card, Space, Drawer, List } from 'antd';
import { DownloadOutlined, QrcodeOutlined, BarcodeOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
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

  const [history, setHistory] = useCacheState<string[]>('code-history', []);
  const [historyVisible, setHistoryVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto save to history after 1s of no typing
  useEffect(() => {
    if (!input || input.trim() === '') return;
    const timer = setTimeout(() => {
      setHistory(prev => {
        const trimmed = input.trim();
        const filtered = prev.filter(item => item !== trimmed);
        return [trimmed, ...filtered].slice(0, 100);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [input, setHistory]);

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

      <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Nội dung (Input Data)</span>
                <Button 
                  type="text" 
                  icon={<HistoryOutlined />} 
                  onClick={() => setHistoryVisible(true)}
                  title="Lịch sử (100 mục gần nhất)"
                />
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ 
              header: { borderBottom: '1px solid #f0f0f0' }, 
              body: { flex: 1, padding: 0, display: 'flex' } 
            }}
          >
            <TextArea
              style={{ 
                flex: 1, 
                resize: 'none', 
                fontSize: 16, 
                padding: 16, 
                fontFamily: 'monospace',
                border: 'none',
                borderRadius: 0,
                boxShadow: 'none'
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập nội dung để tạo mã..."
            />
          </Card>
        </Col>
        
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Kết quả (Output)</span>
                <Button type="primary" size="small" icon={<DownloadOutlined />} onClick={handleDownload} disabled={!input}>
                  Tải xuống
                </Button>
              </div>
            }
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            styles={{ 
              header: { borderBottom: '1px solid #f0f0f0' }, 
              body: { 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                background: isDark ? '#141414' : '#f0f2f5',
                overflow: 'auto'
              } 
            }}
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

      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Lịch sử gần đây (Tối đa 100)</span>
            {history.length > 0 && (
              <Button danger type="text" icon={<DeleteOutlined />} onClick={() => setHistory([])} size="small">Xóa tất cả</Button>
            )}
          </div>
        }
        placement="left"
        onClose={() => setHistoryVisible(false)}
        open={historyVisible}
        width={350}
        styles={{ body: { padding: 0 } }}
      >
        {history.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center' }}><Text type="secondary">Chưa có lịch sử nào.</Text></div>
        ) : (
          <List
            dataSource={history}
            renderItem={(item) => (
              <List.Item 
                style={{ padding: '12px 24px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                onClick={() => {
                  setInput(item);
                  setHistoryVisible(false);
                }}
                className="history-item-hover"
              >
                <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Text>{item}</Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  );
};

export default CodeGenerator;
