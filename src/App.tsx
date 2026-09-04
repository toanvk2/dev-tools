import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, ConfigProvider, Button, Typography } from 'antd';
import { CodeOutlined, SunOutlined, MoonOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined } from '@ant-design/icons';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import TextEncoder from './pages/TextEncoder';
import JwtParser from './pages/JwtParser';
import CodeGenerator from './pages/CodeGenerator';

import { useAppStore } from './store/useAppStore';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const appTheme = useAppStore(state => state.theme);
  const toggleTheme = useAppStore(state => state.toggleTheme);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const isDark = appTheme === 'dark';

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Web DevTools Collection';
      case '/json-formatter': return 'JSON Formatter';
      case '/encoder': return 'Text Encoders / Decoders';
      case '/generator': return 'QR & Barcode Generator';

      case '/jwt': return 'JWT Parser';
      default: return 'DevTools';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" theme={appTheme}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div 
            style={{ 
              height: 32, 
              margin: 16, 
              background: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)', 
              borderRadius: 6, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: isDark ? '#fff' : '#000', 
              fontWeight: 'bold',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
          >
            DEV TOOLS
          </div>
        </Link>
        <Menu
          theme={appTheme}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/json-formatter',
              icon: <CodeOutlined />,
              label: <Link to="/json-formatter">JSON Formatter</Link>,
            },
            {
              key: '/encoder',
              icon: <SwapOutlined />,
              label: <Link to="/encoder">Text Encoders/Decoders</Link>,
            },
            {
              key: '/generator',
              icon: <BarcodeOutlined />,
              label: <Link to="/generator">QR & Barcode Generator</Link>,

            },
            {
              key: '/jwt',
              icon: <SecurityScanOutlined />,
              label: <Link to="/jwt">JWT Parser</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
          <Title level={4} style={{ margin: 0 }}>{getPageTitle(location.pathname)}</Title>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ fontSize: '18px', width: 40, height: 40 }}
          />
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              height: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/encoder" element={<TextEncoder />} />
              <Route path="/generator" element={<CodeGenerator />} />

              <Route path="/jwt" element={<JwtParser />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', transition: 'all 0.3s' }}>
          DevTools ©{new Date().getFullYear()} Created with React & Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
}

const App: React.FC = () => {
  const appTheme = useAppStore(state => state.theme);
  
  const antdTheme = useMemo(() => ({
    algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }), [appTheme]);

  return (
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
