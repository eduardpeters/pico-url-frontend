import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    js.configs.recommended,
    tseslint.configs.recommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat["jsx-runtime"], // disables react/react-in-jsx-scope
    reactHooksPlugin.configs.flat["recommended-latest"],
    jsxA11y.flatConfigs.recommended,
    { settings: { react: { version: "19.0" } } },
    prettier, // must be last — disables conflicting formatting rules
);
