import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.node },
		rules: {
			"no-unused-vars": ["error"],
			"array-callback-return": ["error", { checkForEach: true }],
			"no-constructor-return": "error",
			"no-duplicate-imports": "error",
			"no-promise-executor-return": "error",
			"no-self-compare": "error",
			"no-template-curly-in-string": "error",
			"no-unassigned-vars": "error",
			"no-unmodified-loop-condition": "error",
			"no-unreachable-loop": "error",
			"no-use-before-define": ["error", { functions: false, allowNamedExports: true }],
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
