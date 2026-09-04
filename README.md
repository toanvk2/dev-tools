# Web DevTools Collection 🛠️

A modern, fast, and secure collection of developer tools built with React, TypeScript, Vite, and Ant Design. All data processing is done **100% Client-side** directly in your browser, ensuring maximum privacy and speed.

🟢 **Live Demo:** [https://toanvk2.github.io/dev-tools/](https://toanvk2.github.io/dev-tools/)

## 🚀 Features

- **JSON Formatter:** Format, beautify, and parse JSON strings with an interactive Tree View. Includes a "JS Eval" mode to parse loose JavaScript objects.
- **Text Encoders / Decoders:** A unified tool to instantly encode/decode Base64, URL formats, Unicode (`\uXXXX`), HTML Entities, and Hex strings.
- **JWT Parser:** Safely decode JSON Web Tokens locally to inspect Header, Payload, and Signature without sending sensitive tokens to any server.
- **QR & Barcode Generator:** Generate high-quality QR codes and various Barcode formats (CODE128, EAN13, UPC, etc.) with customizable error correction levels. Download as PNG/SVG.
- **Persistent State:** Tool inputs are cached in memory so you don't lose data when switching between tabs.
- **Dark/Light Mode:** Seamless theme toggling to match your system preferences.

## 💻 Tech Stack
- React 18
- TypeScript
- Vite
- Ant Design v5
- Monaco Editor
- Zustand (State Management)

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/toanvk2/dev-tools.git
   ```
2. Install dependencies (using pnpm):
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## 📜 License
MIT
