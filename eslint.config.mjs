import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const eslintConfig = [
  {
    ignores: [
      "node_modules",
      "dist",
      "src/protos/*.ts",
      "src/protos/**",
    ],
  },
  {
    files: [
      "**/*.{js,mjs,cjs,ts}",
    ],
  },
  {
    files: [
      "**/*.js",
    ],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];


export default eslintConfig;