import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.PORT,
    hmrPort: process.env.VITE_HMR_PORT,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      process.env.VITE_ALLOWED_HOSTNAME
    ]
  }
})
