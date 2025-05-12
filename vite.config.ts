import path, { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  /** 将 SVG 静态图转化为 Vue 组件 */
    svgLoader({ defaultImport: 'url' }),
    /** SVG */
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
    })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4001,
    open: true,
    cors: true,
    // proxy: {
    //   '/api/v1': {
    //     target: 'https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212',
    //     ws: true,
    //     /** 是否允许跨域 */
    //     changeOrigin: true,
    //   },
    // },
  },
})
