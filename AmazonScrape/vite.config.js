import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3300", // Ensure this is where your backend is running
    },
  },
});
