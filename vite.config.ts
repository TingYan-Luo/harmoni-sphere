import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  assetsInclude: ['**/*.glb'], // 将 GLB 识别为静态资源
  build: {
    assetsInlineLimit: 0, // 禁止将文件转为 base64（确保文件被复制）
  }
})
