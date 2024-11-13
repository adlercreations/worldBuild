import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5555',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        // configure: (proxy, options) => {
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     console.log('[Vite Proxy] /api request: ${proxyReq.path}');
        //   });
        // }
        // bypass: (req) => {
        //   console.log('Proxying API request: ${req.url}');
        //   return null;
        // }
      },
      '/auth': {
        target: 'http://localhost:5555',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/auth/, ''),
        // configure: (proxy, options) => {
        //   proxy.on('proxyReq', (proxyReq, reg, res) => {
        //     console.log('[Vite Proxy] /api request: ${proxyReq.path}');
        //   });
        // }
        // bypass: (req) => {
        //   console.log('Proxying Auth request: ${req.url}');
        //   return null;
        // }
      },
    },
  },
})
