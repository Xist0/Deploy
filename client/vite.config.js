import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://192.168.1.211:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    https: {
      key: './CRMServe-private.key',
      cert: './CRMServe.crt',
    }
  },
  plugins: [react()],
})
