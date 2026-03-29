import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
// @ts-ignore vite-plugin-eslint types not exported for Vite 8
import eslintPlugin from 'vite-plugin-eslint';

import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  publicDir: './src/assets',
  // Tauri expects a fixed port, must match tauri.conf.json devUrl
  clearScreen: false,
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'package.json': resolve(__dirname, 'package.json'),
    },
  },
  plugins: [
    react(),
    eslintPlugin({
      include: [
        './src/**/*.ts',
        './src/**/*.tsx',
      ],
      fix: true,
    }),
  ],
  build: {
    outDir: resolve(__dirname, './dist'),
    emptyOutDir: true,
    target: 'esnext',
    rolldownOptions: {
      output: {
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/konva') || id.includes('node_modules/react-konva')) {
            return 'vendor-konva';
          }
          if (id.includes('node_modules/react-toastify') || id.includes('node_modules/recoil')) {
            return 'vendor-ui';
          }
        },
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8001,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
});
