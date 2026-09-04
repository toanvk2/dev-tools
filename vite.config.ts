import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Giúp file build chạy được trên mọi đường dẫn (kể cả repo con của Github Pages)
})
