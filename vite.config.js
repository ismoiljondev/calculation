import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load .env .env.[mode]
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
      }),
      tsconfigPaths({
        parseNative: false,
      }),
      svgrPlugin(),
      {
        name: "custom-hmr-control",
        handleHotUpdate({ file, server }) {
          if (file.includes("src/app/configs/")) {
            server.ws.send({
              type: "full-reload",
            });
            return [];
          }
        },
      },
      tailwindcss(),
    ],
    build: {
      outDir: "build",
    },
    server: {
      host: "0.0.0.0",
      open: true,
      strictPort: false,
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
        "/keycloack": {
          target: env.VITE_KEYCLOACK_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/keycloack/, ""),
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
    },

    define: {
      "import.meta.env.VITE_PORT": JSON.stringify(process.env.PORT || 3000),
      global: "window",
    },
    resolve: {
      alias: {
        "@": "/src",
        "@fuse": "/src/@fuse",
        "@history": "/src/@history",
        "@lodash": "/src/@lodash",
        "@mock-api": "/src/@mock-api",
        "@schema": "/src/@schema",
        "app/store": "/src/app/store",
        "app/shared-components": "/src/app/shared-components",
        "app/configs": "/src/app/configs",
        "app/theme-layouts": "/src/app/theme-layouts",
        "app/AppContext": "/src/app/AppContext",
      },
    },
    optimizeDeps: {
      include: [
        "@mui/icons-material",
        "@mui/material",
        "@mui/base",
        "@mui/styles",
        "@mui/system",
        "@mui/utils",
        "@emotion/cache",
        "@emotion/react",
        "@emotion/styled",
        "date-fns",
        "lodash",
      ],
      exclude: [],
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
  });
};
