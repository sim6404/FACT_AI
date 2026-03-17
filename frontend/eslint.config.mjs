import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    linterOptions: {
      // Don't error on disable comments for unknown rules
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      // Allow unescaped quote chars in JSX text
      "react/no-unescaped-entities": "off",
      // Allow `any` type (handled by TypeScript itself)
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
