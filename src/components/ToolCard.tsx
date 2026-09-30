import React from 'react';
import { Card }
from 'antd';
import type { CardProps } from 'antd';

export interface ToolCardProps extends CardProps {
  noPadding?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ noPadding = true, style, styles, ...props }) => {
  return (
    <Card
      style={{ flex: 1, display: 'flex', flexDirection: 'column', ...style }}
      styles={{
        body: {
          flex: 1,
          padding: noPadding ? 0 : 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...(styles && typeof styles === 'object' ? (styles as any).body : {})
        },
        ...styles
      }}
      {...props}
    />
  );
};

export default ToolCard;
