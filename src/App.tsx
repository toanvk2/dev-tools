import React, { useMemo, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, ConfigProvider, Button, Typography } from 'antd';
import { Html5Outlined, CodeOutlined, SunOutlined, MoonOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined } from '@ant-design/icons';
const Home = lazy(() => import('./pages/Home'));
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'));
const TextEncoder = lazy(() => import('./pages/TextEncoder'));
const JwtParser = lazy(() => import('./pages/JwtParser'));
const CodeGenerator = lazy(() => import('./pages/CodeGenerator'));
const DiffChecker = lazy(() => import('./pages/DiffChecker'));
const HashGenerator = lazy(() => import('./pages/HashGenerator'));
const TimestampConverter = lazy(() => import('./pages/TimestampConverter'));
const ColorConverter = lazy(() => import('./pages/ColorConverter'));
const CronParser = lazy(() => import('./pages/CronParser'));
const RandomGenerator = lazy(() => import('./pages/RandomGenerator'));
const HtmlViewer = lazy(() => import('./pages/HtmlViewer'));
import { FieldTimeOutlined, ThunderboltOutlined, DatabaseOutlined, SafetyOutlined, AppstoreAddOutlined, ToolOutlined } from '@ant-design/icons';

import { DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined } from '@ant-design/icons';

import { useAppStore } from './store/useAppStore';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const appTheme = useAppStore(state => state.theme);
  const toggleTheme = useAppStore(state => state.toggleTheme);
  
  const {
  } = theme.useToken();
  const location = useLocation();
  
  // Find the parent key for the active route
  const getActiveGroup = () => {
    const path = location.pathname;
    if (['/json-formatter', '/diff'].includes(path)) return 'data';
    if (['/encoder', '/jwt', '/hash'].includes(path)) return 'security';
    if (['/random', '/generator'].includes(path)) return 'generators';
    if (['/timestamp', '/cron'].includes(path)) return 'time';
    if (['/color', '/html-viewer'].includes(path)) return 'design';
    return '';
  };

  const isDark = appTheme === 'dark';

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'DevTools';
      case '/json-formatter': return 'JSON Formatter';
      case '/encoder': return 'Text Encoders / Decoders';
      case '/jwt': return 'JWT Parser';
      case '/generator': return 'QR & Barcode Generator';
      case '/diff': return 'Diff Checker';
      case '/hash': return 'Hash Generator';
      case '/timestamp': return 'Epoch Timestamp Converter';
      case '/color': return 'Color Picker / Converter';
      case '/cron': return 'Cron Job Parser';
      case '/random': return 'Random Generator (UUID/Password)';


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
          defaultOpenKeys={[getActiveGroup()]} selectedKeys={[location.pathname]}
          items={[
            {
              key: 'data',
              icon: <DatabaseOutlined />,
              label: 'Data & Code',
              children: [
                
                { key: '/json-formatter', icon: <CodeOutlined />, label: <Link to="/json-formatter">JSON Formatter</Link> },
                { key: '/diff', icon: <DiffOutlined />, label: <Link to="/diff">Diff Checker</Link> }
              ]
            },
            {
              key: 'security',
              icon: <SafetyOutlined />,
              label: 'Crypto & Security',
              children: [
                { key: '/encoder', icon: <SwapOutlined />, label: <Link to="/encoder">Text Encoders</Link> },
                { key: '/jwt', icon: <SecurityScanOutlined />, label: <Link to="/jwt">JWT Parser</Link> },
                { key: '/hash', icon: <KeyOutlined />, label: <Link to="/hash">Hash Generator</Link> }
              ]
            },
            {
              key: 'generators',
              icon: <AppstoreAddOutlined />,
              label: 'Generators',
              children: [
                { key: '/random', icon: <ThunderboltOutlined />, label: <Link to="/random">Random Data</Link> },
                { key: '/generator', icon: <BarcodeOutlined />, label: <Link to="/generator">QR & Barcode</Link> }
              ]
            },
            {
              key: 'time',
              icon: <ClockCircleOutlined />,
              label: 'Time & Cron',
              children: [
                { key: '/timestamp', icon: <FieldTimeOutlined />, label: <Link to="/timestamp">Epoch Converter</Link> },
                { key: '/cron', icon: <ToolOutlined />, label: <Link to="/cron">Cron Parser</Link> }
              ]
            },
            {
              key: 'design',
              icon: <BgColorsOutlined />,
              label: 'Design & UI',
              children: [
                { key: '/html-viewer', icon: <Html5Outlined />, label: <Link to="/html-viewer">HTML Viewer</Link> },
                { key: '/color', label: <Link to="/color">Color Picker</Link> }
              ]
            }
          ]}
        />
      </Sider>
      <Layout style={{ background: isDark ? '#000000' : '#f5f5f5' }}>
        <Header style={{ padding: '0 24px', background: isDark ? '#141414' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
          <Title level={4} style={{ margin: 0 }}>{getPageTitle(location.pathname)}</Title>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ fontSize: '18px', width: 40, height: 40 }}
          />
        </Header>
        <Content style={{ padding: 24, margin: 0, height: '100%', overflow: 'auto' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={<div style={{ padding: 50, textAlign: 'center', fontSize: 16 }}>Đang tải công cụ... (Loading)</div>}>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/html-viewer" element={<HtmlViewer />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/encoder" element={<TextEncoder />} />
              <Route path="/jwt" element={<JwtParser />} />
              <Route path="/generator" element={<CodeGenerator />} />
              <Route path="/diff" element={<DiffChecker />} />
              <Route path="/hash" element={<HashGenerator />} />
              <Route path="/timestamp" element={<TimestampConverter />} />
              <Route path="/color" element={<ColorConverter />} />
              <Route path="/cron" element={<CronParser />} />
              <Route path="/random" element={<RandomGenerator />} />


            </Routes>
            </Suspense>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', transition: 'all 0.3s', background: 'transparent' }}>
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
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </ConfigProvider>
  );
};

export default App;
