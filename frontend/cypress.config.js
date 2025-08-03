import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    supportFile: "cypress/support/component.js",
  },
  e2e: {
    baseUrl: "http://localhost:5173",
  },
});
