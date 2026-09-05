const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find where location is defined
const locationRegex = /const location = useLocation\(\);/;
const locationMatch = code.match(locationRegex);

if (locationMatch) {
  const getOpenKeysLogic = `
  const location = useLocation();
  
  // Find the parent key for the active route
  const getActiveGroup = () => {
    const path = location.pathname;
    if (['/json-formatter', '/diff'].includes(path)) return 'data';
    if (['/encoder', '/jwt', '/hash'].includes(path)) return 'security';
    if (['/random', '/generator'].includes(path)) return 'generators';
    if (['/timestamp', '/cron'].includes(path)) return 'time';
    if (['/color'].includes(path)) return 'design';
    return '';
  };
`;
  code = code.replace(locationRegex, getOpenKeysLogic.trim());
  
  // Add defaultOpenKeys to Menu
  code = code.replace(/<Menu mode="inline"/, `<Menu mode="inline" defaultOpenKeys={[getActiveGroup()]}`);
  fs.writeFileSync('src/App.tsx', code);
}
