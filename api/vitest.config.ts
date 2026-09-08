import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 30000,
    env: {
      NODE_ENV: "test",
    },
  },
});
