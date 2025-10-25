import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{js,jsx}"],
		extends: [
			js.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		rules: {
			"no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
			"array-callback-return": ["error", { checkForEach: true }],
			"no-constructor-return": "error",
			"no-duplicate-imports": "error",
			"no-promise-executor-return": "error",
			"no-self-compare": "error",
			"no-template-curly-in-string": "error",
			"no-unassigned-vars": "error",
			"no-unmodified-loop-condition": "error",
			"no-unreachable-loop": "error",
			"no-use-before-define": [
				"error",
				{ functions: false, allowNamedExports: true },
			],
			"require-atomic-updates": "error",
			"no-var": "error",
			eqeqeq: "error",
			"prefer-const": "error",
			"no-unused-expressions": [
				"error",
				{
					allowShortCircuit: true,
					allowTernary: true,
					allowTaggedTemplates: true,
					enforceForJSX: true,
				},
			],
			"no-lonely-if": "error",
			"no-lone-blocks": "error",
			"no-useless-call": "error",
			"prefer-object-has-own": "error",
			"prefer-promise-reject-errors": "error",
			"no-throw-literal": "error",
		},
	},
	eslintConfigPrettier,
]);
