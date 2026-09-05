const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const importsToAdd = `import { CodeOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined, DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined, FieldTimeOutlined, ThunderboltOutlined } from '@ant-design/icons';`;
code = code.replace("import { CodeOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined, DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined } from '@ant-design/icons';", importsToAdd);

const newCards = `
    {
      title: 'Cron Job Parser',
      description: 'Dịch biểu thức Cron sang tiếng Việt và liệt kê 5 thời điểm chạy tiếp theo.',
      icon: <FieldTimeOutlined style={{ fontSize: 40, color: '#fa541c' }} />,
      link: '/cron'
    },
    {
      title: 'Random Generator',
      description: 'Tạo mã UUID/GUID hàng loạt hoặc sinh mật khẩu ngẫu nhiên với độ dài tuỳ chỉnh.',
      icon: <ThunderboltOutlined style={{ fontSize: 40, color: '#a0d911' }} />,
      link: '/random'
    }
  ];
`;

code = code.replace(`    }\n  ];`, `    },` + newCards);

fs.writeFileSync('src/pages/Home.tsx', code);
