import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Tooltip, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';
import CryptoJS from 'crypto-js';

const { Text } = Typography;
const { TextArea } = Input;

const HashGenerator: React.FC = () => {
  const [input, setInput] = useCacheState<string>('hash-input', '');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }
    
    // Using setTimeout to prevent blocking UI on large inputs
    const timer = setTimeout(() => {
      setHashes({
        MD5: CryptoJS.MD5(input).toString(),
        SHA1: CryptoJS.SHA1(input).toString(),
        SHA256: CryptoJS.SHA256(input).toString(),
        SHA512: CryptoJS.SHA512(input).toString(),
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [input]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã copy!');
  };

  const hashTypes = ['MD5', 'SHA1', 'SHA256', 'SHA512'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={24} style={{ flex: 1 }}>
        <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <Text strong>Text gốc (Original Text)</Text>
          </div>
          <TextArea
            style={{ flex: 1, resize: 'none', fontSize: 16, padding: 16, fontFamily: 'monospace' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập chữ cần băm vào đây..."
          />
        </Col>
        
        <Col span={14} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {hashTypes.map(type => (
            <div key={type} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong style={{ color: '#1890ff' }}>{type}</Text>
                {hashes[type] && (
                  <Tooltip title="Copy">
                    <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(hashes[type])} />
                  </Tooltip>
                )}
              </div>
              <div style={{ 
                padding: 12, 
                background: isDark ? '#141414' : '#f5f5f5', 
                border: '1px solid', 
                borderColor: isDark ? '#434343' : '#d9d9d9',
                borderRadius: 6,
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: 14,
                minHeight: 46,
                display: 'flex',
                alignItems: 'center'
              }}>
                {hashes[type] || <Text type="secondary">Chưa có dữ liệu</Text>}
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default HashGenerator;
