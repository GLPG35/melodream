import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: !process.env.PORT ? 'http://localhost:3000/' : 'https://melodream-server.onrender.com/',
        changeOrigin: true
      },
      '/static': {
        target: !process.env.PORT ? 'http://localhost:3000/' : 'https://melodream-server.onrender.com/',
        changeOrigin: true
      }
    }
  }
})
