import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SequentialUIVue',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue', '@sequential-ui/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@sequential-ui/core': 'SequentialUICore'
        },
        assetFileNames: 'style.css'
      }
    },
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      '@sequential-ui/core': resolve(__dirname, '../core/dist')
    }
  }
})