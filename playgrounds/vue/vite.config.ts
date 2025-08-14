import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@sequential-ui/core': resolve(__dirname, '../../packages/core/src'),
      '@sequential-ui/vue': resolve(__dirname, '../../packages/vue/src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})