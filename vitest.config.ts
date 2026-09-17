import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/cypress/**", "**/.next/**"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/data/**", "src/hooks/**", "src/lib/**"],
      exclude: ["**/__tests__/**", "**/*.test.*", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: [
      { find: /^@\/stores\/(.*)/, replacement: path.resolve(__dirname, "./apps/budgethub/src/stores/$1") },
      { find: /^@\/lib\/preferences\/(.*)/, replacement: path.resolve(__dirname, "./apps/budgethub/src/lib/preferences/$1") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});
