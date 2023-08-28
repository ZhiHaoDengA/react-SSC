import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'


export default defineConfig({
  plugins: [
      react(),
    createStyleImportPlugin({
      resolves: [AntdResolve()]
    })
  ],
  optimizeDeps: {
    include: ['react-is']
  },
  resolve:{
    alias:{
      '@': path.resolve(__dirname,'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: { // 更改主题在这里
          'primary-color': '#52c41a',
          'link-color': '#1DA57A',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  }
  // proxy: {
  //   '/api': {
  //     target: 'http://10.0.40.200:8979',
  //     ws: false,
  //     changeOrigin: true,
  //     rewrite: path => path.replace(/^\/api/, '')
  //   }
  // }
})
