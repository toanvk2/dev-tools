const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import DiffChecker from './pages/DiffChecker';
import HashGenerator from './pages/HashGenerator';
import TimestampConverter from './pages/TimestampConverter';
import ColorConverter from './pages/ColorConverter';
import { DiffOutlined, KeyOutlined, ClockCircleOutlined, BgColorsOutlined } from '@ant-design/icons';
`;

code = code.replace("import CodeGenerator from './pages/CodeGenerator';", "import CodeGenerator from './pages/CodeGenerator';\n" + importsToAdd);

const titlesToAdd = `
      case '/diff': return 'Diff Checker';
      case '/hash': return 'Hash Generator';
      case '/timestamp': return 'Epoch Timestamp Converter';
      case '/color': return 'Color Picker / Converter';
`;
code = code.replace("case '/generator': return 'QR & Barcode Generator';", "case '/generator': return 'QR & Barcode Generator';" + titlesToAdd);

const menuItemsToAdd = `
            {
              key: '/diff',
              icon: <DiffOutlined />,
              label: <Link to="/diff">Diff Checker</Link>,
            },
            {
              key: '/hash',
              icon: <KeyOutlined />,
              label: <Link to="/hash">Hash Generator</Link>,
            },
            {
              key: '/timestamp',
              icon: <ClockCircleOutlined />,
              label: <Link to="/timestamp">Epoch Converter</Link>,
            },
            {
              key: '/color',
              icon: <BgColorsOutlined />,
              label: <Link to="/color">Color Picker</Link>,
            }
`;
// Find the exact end of items array and insert.
code = code.replace(`label: <Link to="/generator">QR & Barcode Generator</Link>,\n            }`, `label: <Link to="/generator">QR & Barcode Generator</Link>,\n            },` + menuItemsToAdd);

const routesToAdd = `
              <Route path="/diff" element={<DiffChecker />} />
              <Route path="/hash" element={<HashGenerator />} />
              <Route path="/timestamp" element={<TimestampConverter />} />
              <Route path="/color" element={<ColorConverter />} />
`;
code = code.replace(`<Route path="/generator" element={<CodeGenerator />} />`, `<Route path="/generator" element={<CodeGenerator />} />` + routesToAdd);

fs.writeFileSync('src/App.tsx', code);
