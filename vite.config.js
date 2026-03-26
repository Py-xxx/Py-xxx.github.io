import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/portfolio/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist/portfolio',
    rollupOptions: {
      input: {
        main:          resolve(__dirname, 'index.html'),
        about:         resolve(__dirname, 'about.html'),
        warstonks:     resolve(__dirname, 'projects/warstonks.html'),
        raven:         resolve(__dirname, 'projects/raven.html'),
        haileysSong:      resolve(__dirname, 'writing/haileys-song.html'),
        beforeIVanished:  resolve(__dirname, 'writing/before-i-vanished.html'),
      },
    },
  },
})
