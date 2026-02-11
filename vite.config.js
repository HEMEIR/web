import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const isProdEnv = process.env.NODE_ENV === 'production';
const PUBLIC_PATH = '/';
const OUT_DIR = isProdEnv ? 'build' : 'build';
const PLUGINS = [react()];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '::',
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 后端服务地址
        changeOrigin: true,
      },
    },
    port: '8080',
    hmr: {
      overlay: false
    }
  },
  plugins: [
    PLUGINS
  ],
  base: PUBLIC_PATH,
  build: {
    outDir: OUT_DIR
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: 'lib',
        replacement: resolve(__dirname, 'lib'),
      },
    ],
  },
});