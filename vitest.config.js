// @ts-check
const { defineConfig } = require("vitest/config");

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
