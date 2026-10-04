import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

const LOCAL_API_URL = 'http://localhost:5000/api/v1';

export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiUrl = env.VITE_API_URL?.trim() || (command === 'serve' ? LOCAL_API_URL : '');

  if (!apiUrl) {
    throw new Error(
      'VITE_API_URL is required for production builds. Copy .env.example to .env or set VITE_API_URL in the build environment.',
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    build: {sourcemap: false},
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
