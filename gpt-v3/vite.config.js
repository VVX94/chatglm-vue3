import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ],
  },
  server:{
    host: '0.0.0.0',
    proxy:{
      '/api':{
        target:'https://glmapi.gaozih.top/',
        changeOrigin:true, //允许跨域
        rewrite:(path) => path.replace(/^\/api/,'') //重写路径
      }
    }
  }

})

