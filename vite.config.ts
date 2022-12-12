import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vitest/config'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url))
    },
  },

  test: {
    globals: true
  },

  build:{
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.ts'),
      name: 'gbifference',
      fileName: format => `gbifference.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        dir: "dist",
        globals: {},
      }
    }
  }
})