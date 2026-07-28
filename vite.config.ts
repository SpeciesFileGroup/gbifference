import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  test: {
    globals: true
  },

  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/lib/main.ts', import.meta.url)),
      name: 'gbifference',
      fileName: (format) => `gbifference.${format}.js`,
      cssFileName: 'style'
    },
    rollupOptions: {
      external: [],
      output: {
        dir: 'dist',
        globals: {}
      }
    }
  }
})
