import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>Chào mừng đến với DevTools</Title>
      <Paragraph>
        Đây là bộ công cụ dành cho Developer. Tất cả các thao tác xử lý dữ liệu đều được thực hiện <strong>100% tại local (trình duyệt)</strong>, đảm bảo tốc độ và quyền riêng tư tuyệt đối.
      </Paragraph>
      <Paragraph>
        Chọn một công cụ từ menu bên trái để bắt đầu.
      </Paragraph>
    </div>
  );
};

export default Home;
