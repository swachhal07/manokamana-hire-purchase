import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // In dev, /api requests go to the Express backend (backend/ — port 5000).
    // In production set VITE_API_URL instead (see src/lib/api.js).
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
