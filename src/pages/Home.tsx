import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { Html5Outlined, CodeOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined, DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined, FieldTimeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
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
      title: 'HTML Viewer',
      description: 'Soạn thảo và Live Preview HTML, CSS, JS ngay trên trình duyệt mà không cần Server.',
      icon: <Html5Outlined style={{ fontSize: 40, color: '#e34f26' }} />,
      link: '/html-viewer'
    },
    {
      title: 'Color Converter',
      description: 'Bảng chọn màu trực quan và chuyển đổi qua lại giữa các chuẩn HEX, RGB, HSL.',
      icon: <BgColorsOutlined style={{ fontSize: 40, color: '#fadb14' }} />,
      link: '/color'
    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <img src="./favicon.svg" alt="Web DevTools Logo" style={{ width: 80, height: 80, marginBottom: 24 }} />
        <Title level={1} style={{ marginBottom: 16 }}>Web DevTools Collection</Title>
        <Paragraph style={{ fontSize: 18, color: '#8c8c8c' }}>
          Bộ công cụ tối thượng dành cho Developer.
        </Paragraph>
        <Paragraph style={{ fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
          Tất cả các tác vụ xử lý dữ liệu đều được thực hiện <strong>100% tại Client-side (Trình duyệt)</strong>,
          đảm bảo tốc độ cực nhanh và bảo mật tuyệt đối cho dữ liệu nhạy cảm của bạn.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {features.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Link to={item.link} style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                style={{ height: '100%', borderRadius: 16, textAlign: 'center', border: '1px solid #f0f0f0' }}
                styles={{ body: { padding: '40px 24px' } }}
              >
                <div style={{ marginBottom: 24 }}>{item.icon}</div>
                <Title level={4} style={{ marginBottom: 16 }}>{item.title}</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>{item.description}</Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
