import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  root: resolve(__dirname, 'desktop'),
  server: {
    port: 5174,
    proxy: {
      '/portfolio': 'http://localhost:5173',
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false, // portfolio already built to dist/ — don't wipe it
    rollupOptions: {
      input: {
        desktop: resolve(__dirname, 'desktop/index.html'),
      },
    },
  },
})
