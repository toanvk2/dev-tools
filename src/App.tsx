import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';

const { Header, Content, Footer, Sider } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
          DEV TOOLS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/',
              icon: <AppstoreOutlined />,
              label: <Link to="/">Trang chủ</Link>,
            },
            {
              key: '/json-formatter',
              icon: <CodeOutlined />,
              label: <Link to="/json-formatter">JSON Formatter</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              height: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          DevTools ©{new Date().getFullYear()} Created with React & Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
