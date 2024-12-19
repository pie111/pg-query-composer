import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		rules: {
			'indent': ['error', 'tab'],        // Enforce tab-based indentation
			'no-tabs': 'off',                 // Allow the use of tabs
			'semi': ['error', 'always'],      // Require semicolons at the end of statements
			'quotes': ['error', 'single'],    // Enforce single quotes
			'comma-dangle': ['error', 'never'], // Disallow trailing commas
			'arrow-parens': ['error', 'always'], // Require parentheses around arrow function arguments
			'object-curly-spacing': ['error', 'always'] // Enforce spaces inside curly braces
		}
	},
	{
		languageOptions: {
			globals: globals.browser
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended
];
