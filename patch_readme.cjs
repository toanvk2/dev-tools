const fs = require('fs');
let text = fs.readFileSync('README.md', 'utf8');

const featuresList = `
- **JSON Formatter:** Format, beautify, and parse JSON strings with an interactive Tree View. Includes a "JS Eval" mode.
- **Diff Checker:** Compare two pieces of text or code side-by-side with Monaco Editor (VS Code core).
- **Text Encoders / Decoders:** Base64, URL formats, Unicode, HTML Entities, Hex.
- **JWT Parser:** Decode JSON Web Tokens locally.
- **Hash Generator:** Generate MD5, SHA1, SHA256, SHA512 instantly.
- **Epoch Timestamp Converter:** Convert Unix timestamps to human-readable dates and vice versa.
- **Color Picker / Converter:** Visual color picker with real-time HEX, RGB, HSB sync.
- **Cron Job Parser:** Translate cron expressions into human-readable text and list next 5 execution times.
- **Random Generator:** Generate UUIDs/GUIDs in bulk or create custom strong passwords/strings.
- **QR & Barcode Generator:** Generate QR codes and Barcodes (CODE128, EAN13, etc.).
`;

text = text.replace(/- \*\*JSON Formatter:\*\*[\s\S]+?- \*\*Dark\/Light Mode:\*\*/, featuresList.trim() + '\n- **Dark/Light Mode:**');
fs.writeFileSync('README.md', text);
