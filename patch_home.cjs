const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const importsToAdd = `import { CodeOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined, DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined } from '@ant-design/icons';`;
code = code.replace("import { CodeOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined } from '@ant-design/icons';", importsToAdd);

const newCards = `
    {
      title: 'Diff Checker',
      description: 'So sánh hai đoạn Text hoặc Code. Đánh dấu chi tiết từng ký tự thay đổi với Monaco Editor.',
      icon: <DiffOutlined style={{ fontSize: 40, color: '#eb2f96' }} />,
      link: '/diff'
    },
    {
      title: 'Hash Generator',
      description: 'Tạo mã băm MD5, SHA1, SHA256, SHA512 tức thì. Không gửi dữ liệu qua mạng.',
      icon: <KeyOutlined style={{ fontSize: 40, color: '#13c2c2' }} />,
      link: '/hash'
    },
    {
      title: 'Epoch Timestamp',
      description: 'Công cụ chuyển đổi 2 chiều giữa Unix Timestamp và Human Readable Date.',
      icon: <ClockCircleOutlined style={{ fontSize: 40, color: '#2f54eb' }} />,
      link: '/timestamp'
    },
    {
      title: 'Color Converter',
      description: 'Bảng chọn màu và chuyển đổi qua lại giữa các chuẩn HEX, RGB, HSB.',
      icon: <BgColorsOutlined style={{ fontSize: 40, color: '#fadb14' }} />,
      link: '/color'
    }
  ];
`;

code = code.replace(`    }\n  ];`, `    },` + newCards);

fs.writeFileSync('src/pages/Home.tsx', code);
