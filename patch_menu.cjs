const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToReplace = `import { CodeOutlined, SunOutlined, MoonOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined, DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined, FieldTimeOutlined, ThunderboltOutlined } from '@ant-design/icons';`;
const newImports = `import { CodeOutlined, SunOutlined, MoonOutlined, SwapOutlined, SecurityScanOutlined, BarcodeOutlined, DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined, FieldTimeOutlined, ThunderboltOutlined, DatabaseOutlined, SafetyOutlined, AppstoreAddOutlined, ToolOutlined } from '@ant-design/icons';`;

code = code.replace(importsToReplace, newImports);

const menuItemsStart = code.indexOf('items={[');
const menuItemsEnd = code.indexOf(']}', menuItemsStart) + 2;

const newMenuItems = `items={[
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
                { key: '/color', label: <Link to="/color">Color Picker</Link> }
              ]
            }
          ]}`;

code = code.substring(0, menuItemsStart) + newMenuItems + code.substring(menuItemsEnd);

fs.writeFileSync('src/App.tsx', code);
