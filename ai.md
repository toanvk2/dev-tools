# Project Name: DevTools

## Tech Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **UI Library:** Ant Design (antd)
- **Icons:** @ant-design/icons
- **Routing:** react-router-dom
- **State Management:** zustand
- **Code Editor:** @monaco-editor/react
- **Other Utils:** qrcode.react, js-base64

## Architecture & Principles
1. **Local Processing Only:** All data processing, encoding, decoding, parsing MUST happen strictly on the client-side (browser). NO sensitive user data should ever be sent to any external server.
2. **Privacy First:** Emphasize that tools handling JSON, Tokens, or hashes are executed locally.
3. **Component Driven:** Reusable UI components. Separate business logic from UI components.
4. **State Management:** Use `zustand` for global app state (e.g., current theme, recent tools used, layout preferences).
5. **Responsiveness:** Ensure tools look good and are usable on different screen sizes using Ant Design's grid system.

## AI Assistant Rules
- Always write code in **TypeScript** and define explicit types/interfaces.
- Prefer **Functional Components** and **React Hooks**.
- Use **Ant Design (antd)** components (Layout, Menu, Table, Form, Input, etc.) to maintain a consistent and professional UI.
- When creating a new tool, place it in `src/pages/[ToolGroup]/[ToolName].tsx` and register its route in the main router.
- Wrap `monaco-editor` instances with proper fallbacks and handle large text inputs gracefully.
- Keep components modular. If a tool becomes complex, split its UI and logic into separate files.
- Avoid external API dependencies for tool functionalities. Everything must work fully offline (PWA-ready in the future).
