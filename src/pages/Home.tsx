import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { CodeOutlined, SwapOutlined, SecurityScanOutlined, ThunderboltOutlined, BarcodeOutlined } from '@ant-design/icons';
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
      title: 'QR & Barcode Generator',
      description: 'Tạo mã QR và Mã vạch (CODE128, EAN, UPC) với nhiều tùy chọn. Tải xuống định dạng ảnh chất lượng cao.',
      icon: <BarcodeOutlined style={{ fontSize: 40, color: '#fa8c16' }} />,
      link: '/generator'

    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <ThunderboltOutlined style={{ fontSize: 56, color: '#faad14', marginBottom: 24 }} />
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
                bodyStyle={{ padding: '40px 24px' }}
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
