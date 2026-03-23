import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const isProdEnv = process.env.NODE_ENV === 'production';
const PUBLIC_PATH = '/';
const OUT_DIR = isProdEnv ? 'build' : 'build';
const PLUGINS = [react()];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const authApiProxyTarget =
    env.VITE_AUTH_API_PROXY_TARGET ||
    env.VITE_API_PROXY_TARGET ||
    'http://127.0.0.1:5001';
  const featureApiProxyTarget =
    env.VITE_FEATURE_API_PROXY_TARGET ||
    'http://127.0.0.1:8010';
  const camceeApiProxyTarget =
    env.VITE_CAMCEE_API_PROXY_TARGET ||
    'http://127.0.0.1:8010';

  return {
    server: {
      host: '::',
      proxy: {
        '/api': {
          target: authApiProxyTarget,
          changeOrigin: true,
        },
        '/feature-api': {
          target: featureApiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/feature-api/, ''),
        },
        '/camcee-api': {
          target: camceeApiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/camcee-api/, ''),
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
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      css: true,
    },
  };
});
