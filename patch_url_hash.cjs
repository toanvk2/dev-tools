const fs = require('fs');
let code = fs.readFileSync('src/pages/UrlParser.tsx', 'utf8');

// 1. Add Tag and Space to antd imports
code = code.replace("Card, Input, Typography, Table, Row, Col, Button, message", "Card, Input, Typography, Table, Row, Col, Button, message, Space, Tag");

// 2. Add useMemo to React imports
code = code.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState, useMemo } from 'react';");

// 3. Replace queryParams logic
const oldQueryParamsStr = `const queryParams = parsed ? Array.from(parsed.searchParams.entries()).map((val, idx) => ({ key: idx, paramKey: val[0], paramValue: val[1] })) : [];`;
const newQueryParamsStr = `  const queryParams = useMemo(() => {
    if (!parsed) return [];
    const params = [];
    let idx = 0;
    
    parsed.searchParams.forEach((val, key) => {
      params.push({ key: idx++, paramKey: key, paramValue: val, source: 'Search' });
    });

    if (parsed.hash.includes('?')) {
      const hashQueryString = parsed.hash.substring(parsed.hash.indexOf('?'));
      const hashParams = new URLSearchParams(hashQueryString);
      hashParams.forEach((val, key) => {
        params.push({ key: idx++, paramKey: key, paramValue: val, source: 'Hash' });
      });
    }
    return params;
  }, [parsed]);`;
code = code.replace(oldQueryParamsStr, newQueryParamsStr);

// 4. Replace columns logic
const oldColumnsStr = `const columns = [
    { title: 'Key', dataIndex: 'paramKey', key: 'paramKey', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Value', dataIndex: 'paramValue', key: 'paramValue' },
  ];`;
const newColumnsStr = `const columns = [
    { 
      title: 'Key', 
      dataIndex: 'paramKey', 
      key: 'paramKey', 
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.source === 'Hash' && <Tag color="orange" style={{ fontSize: 10, lineHeight: '14px', border: 0 }}>Hash</Tag>}
        </Space>
      ) 
    },
    { title: 'Value', dataIndex: 'paramValue', key: 'paramValue' },
  ];`;
code = code.replace(oldColumnsStr, newColumnsStr);

fs.writeFileSync('src/pages/UrlParser.tsx', code);
