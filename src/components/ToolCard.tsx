import React, { useState } from 'react';
import { Card, Button, Tooltip, message, Space } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import type { CardProps } from 'antd';

export interface ToolCardProps extends CardProps {
  noPadding?: boolean;
  copyText?: string;
  onCopySuccess?: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  noPadding = true,
  copyText,
  onCopySuccess,
  extra,
  style,
  styles,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText) {
      message.warning('Không có nội dung để sao chép!');
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      message.success('Đã sao chép vào bộ nhớ tạm!');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopySuccess?.();
    } catch (err: any) {
      message.error('Không thể sao chép: ' + (err?.message || 'Lỗi không xác định'));
    }
  };

  const renderExtra = () => {
    if (copyText === undefined) {
      return extra;
    }
    const copyButton = (
      <Tooltip key="copy-all" title={copied ? 'Đã sao chép!' : 'Sao chép toàn bộ (Copy All)'}>
        <Button
          type="text"
          size="small"
          icon={copied ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
          onClick={handleCopy}
          aria-label="Sao chép toàn bộ"
        />
      </Tooltip>
    );

    if (extra) {
      return (
        <Space size={8}>
          {extra}
          {copyButton}
        </Space>
      );
    }
    return copyButton;
  };

  return (
    <Card
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', ...style }}
      styles={{
        ...styles,
        body: {
          flex: 1,
          minHeight: 0,
          padding: noPadding ? 0 : 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...(styles && typeof styles === 'object' ? (styles as any).body : {})
        }
      }}
      extra={renderExtra()}
      {...props}
    />
  );
};

export default ToolCard;
