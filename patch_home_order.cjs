const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const featuresList = `
  const features = [
    {
      title: 'JSON Formatter',
      description: 'Định dạng, làm đẹp và phân tích cú pháp JSON. Hỗ trợ JS Eval để đọc Object lỏng lẻo.',
      icon: <CodeOutlined style={{ fontSize: 40, color: '#1890ff' }} />,
      link: '/json-formatter'
    },
    {
      title: 'Diff Checker',
      description: 'So sánh hai đoạn Text hoặc Code. Đánh dấu chi tiết từng ký tự thay đổi với Monaco Editor.',
      icon: <DiffOutlined style={{ fontSize: 40, color: '#eb2f96' }} />,
      link: '/diff'
    },
    {
      title: 'Text Encoders / Decoders',
      description: 'Mã hoá và giải mã đa định dạng (Base64, URL, Unicode, HTML, Hex) trong 1 thao tác.',
      icon: <SwapOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
      link: '/encoder'
    },
    {
      title: 'JWT Parser',
      description: 'Phân tích và giải mã JSON Web Token (JWT) cục bộ không cần gửi qua Server.',
      icon: <SecurityScanOutlined style={{ fontSize: 40, color: '#722ed1' }} />,
      link: '/jwt'
    },
    {
      title: 'Hash Generator',
      description: 'Tạo mã băm MD5, SHA1, SHA256, SHA512 tức thì. Không gửi dữ liệu qua mạng.',
      icon: <KeyOutlined style={{ fontSize: 40, color: '#13c2c2' }} />,
      link: '/hash'
    },
    {
      title: 'Random Generator',
      description: 'Tạo mã UUID hàng loạt hoặc sinh mật khẩu, số ngẫu nhiên với tuỳ chỉnh.',
      icon: <ThunderboltOutlined style={{ fontSize: 40, color: '#a0d911' }} />,
      link: '/random'
    },
    {
      title: 'QR & Barcode',
      description: 'Tạo mã QR và Mã vạch (CODE128, EAN, UPC) với nhiều tùy chọn. Tải xuống ảnh.',
      icon: <BarcodeOutlined style={{ fontSize: 40, color: '#fa8c16' }} />,
      link: '/generator'
    },
    {
      title: 'Epoch Timestamp',
      description: 'Công cụ chuyển đổi 2 chiều giữa Unix Timestamp và Human Readable Date.',
      icon: <ClockCircleOutlined style={{ fontSize: 40, color: '#2f54eb' }} />,
      link: '/timestamp'
    },
    {
      title: 'Cron Job Parser',
      description: 'Dịch biểu thức Cron sang tiếng Việt và liệt kê 5 thời điểm chạy tiếp theo.',
      icon: <FieldTimeOutlined style={{ fontSize: 40, color: '#fa541c' }} />,
      link: '/cron'
    },
    {
      title: 'Color Converter',
      description: 'Bảng chọn màu trực quan và chuyển đổi qua lại giữa các chuẩn HEX, RGB, HSL.',
      icon: <BgColorsOutlined style={{ fontSize: 40, color: '#fadb14' }} />,
      link: '/color'
    }
  ];
`;

const regex = /const features = \[[\s\S]+?\];\s+return/g;
code = code.replace(regex, featuresList.trim() + '\n\n  return');
fs.writeFileSync('src/pages/Home.tsx', code);
