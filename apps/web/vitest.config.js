import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ['./test/vitest.setup.ts']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
