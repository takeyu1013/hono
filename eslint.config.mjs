import globals from "globals";
import js from "@eslint/js";
import tsEsLintPlugin from "@typescript-eslint/eslint-plugin";
import tsEsLintParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tsEsLintPlugin,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsEsLintParser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      ...tsEsLintPlugin.configs["eslint-recommended"].rules,
      ...tsEsLintPlugin.configs["recommended-type-checked"].rules,
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
