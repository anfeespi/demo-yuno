import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://52.15.192.69:8080/v3/api-docs",
    output: {
      target: "./packages/yuno-demo-sdk/src/index.ts",
      client: "fetch",
      biome: true,
      clean: true,
      baseUrl: "http://52.15.192.69:8080",
    },
  },
});
