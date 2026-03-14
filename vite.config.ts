import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    hmr: process.env.VITE_HMR_PORT ? { port: Number(process.env.VITE_HMR_PORT) } : undefined,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      ...(process.env.VITE_ALLOWED_HOSTNAME ? [process.env.VITE_ALLOWED_HOSTNAME] : []),
    ]
  }
})
