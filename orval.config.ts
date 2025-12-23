import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./swagger/swagger.json",
    },
    output: {
      mode: "split",
      target: "src/api/api.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "src/utils/apiFetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
