import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';
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
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].css',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8001,
    strictPort: true,
    // Tauri expects a consistent dev server URL
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  // Prevent vite from obscuring rust errors
  envPrefix: ['VITE_', 'TAURI_'],
});
