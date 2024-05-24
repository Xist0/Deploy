import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import macrosPlugin from 'vite-plugin-babel-macros';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [macrosPlugin(), react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: './src/main.jsx',
    },
  },
  server: {
    port: 24,
    proxy: {
      "/api": {
        target: "https://192.168.1.211:4000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './CRMServe-private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './CRMServe.crt')),
    },
  },
});
