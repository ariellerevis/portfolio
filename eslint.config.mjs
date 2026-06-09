import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
      ".next/**",
      ".screenshots/**",
      ".tmp/**",
      "node_modules/**",
      "out/**",
    "next-env.d.ts",
  ]),
]);
