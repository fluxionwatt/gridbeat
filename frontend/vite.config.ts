// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      // 这里把 @ 映射到 src 目录
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0', // 方便局域网设备访问
    port: 5173,
  },
  // 可选：如果你有用到 defineOptions 等语法可以加上下面这段（使用 volar 的话）
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@use "sass:math";`,
  //     },
  //   },
  // },
})
