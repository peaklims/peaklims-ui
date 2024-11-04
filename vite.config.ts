import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4378,
    strictPort: true,

    // these are the proxy routes that will be forwarded to your **BFF**
    proxy: {
      "/bff": {
        target: "https://localhost:7164",
        secure: false,
      },
      "/signin-oidc": {
        target: "https://localhost:7164",
        secure: false,
      },
      "/signout-callback-oidc": {
        target: "https://localhost:7164",
        secure: false,
      },
      "/api": {
        target: "https://localhost:7164",
        secure: false,
      },
    },
  },
});
