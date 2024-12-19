import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		ignores: ['**/*.test.ts', '**/*.test.js', 'tests/'], // Add ignore patterns here
		rules: {
			'indent': ['error', 'tab'],        // Enforce tab-based indentation
			'no-tabs': 'off',                 // Allow the use of tabs
			'semi': ['error', 'always'],      // Require semicolons at the end of statements
			'quotes': ['error', 'single', { 'avoidEscape': true }],    // Enforce single quotes, but allow escaping
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