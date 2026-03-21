import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/portfolio/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:          resolve(__dirname, 'index.html'),
        about:         resolve(__dirname, 'about.html'),
        warstonks:     resolve(__dirname, 'projects/warstonks.html'),
        haileysSong:   resolve(__dirname, 'writing/haileys-song.html'),
      },
    },
  },
})
