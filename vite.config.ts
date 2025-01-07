import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/qgj-api': {
        target: 'http://10.33.13.207:9091',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/qgj-api/, ''),
      },
    },
  },
})
