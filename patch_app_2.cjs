const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import CronParser from './pages/CronParser';
import RandomGenerator from './pages/RandomGenerator';
import { FieldTimeOutlined, ThunderboltOutlined } from '@ant-design/icons';
`;
code = code.replace("import ColorConverter from './pages/ColorConverter';", "import ColorConverter from './pages/ColorConverter';\n" + importsToAdd);

const titlesToAdd = `
      case '/cron': return 'Cron Job Parser';
      case '/random': return 'Random Generator (UUID/Password)';
`;
code = code.replace("case '/color': return 'Color Picker / Converter';", "case '/color': return 'Color Picker / Converter';" + titlesToAdd);

const menuItemsToAdd = `
            {
              key: '/cron',
              icon: <FieldTimeOutlined />,
              label: <Link to="/cron">Cron Parser</Link>,
            },
            {
              key: '/random',
              icon: <ThunderboltOutlined />,
              label: <Link to="/random">Random Generator</Link>,
            }
`;
code = code.replace(`label: <Link to="/color">Color Picker</Link>,\n            }`, `label: <Link to="/color">Color Picker</Link>,\n            },` + menuItemsToAdd);

const routesToAdd = `
              <Route path="/cron" element={<CronParser />} />
              <Route path="/random" element={<RandomGenerator />} />
`;
code = code.replace(`<Route path="/color" element={<ColorConverter />} />`, `<Route path="/color" element={<ColorConverter />} />` + routesToAdd);

fs.writeFileSync('src/App.tsx', code);
