import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import { importX } from 'eslint-plugin-import-x'
import solid from 'eslint-plugin-solid/configs/recommended'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import vitest from 'eslint-plugin-vitest'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	globalIgnores(['dist', 'docs', 'node_modules']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommendedTypeChecked,
			importX.flatConfigs.recommended,
			importX.configs.typescript,
			solid,
			stylistic.configs.customize({
				braceStyle: '1tbs',
				indent: 'tab',
			}),
		],
		languageOptions: {
			ecmaVersion: 2024,
			globals: globals.browser,
			parserOptions: {
				parser: tsParser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'accessor-pairs': 'error',
			'camelcase': 'error',
			'curly': 'error',
			'no-restricted-syntax': ['warn', {
				selector: 'ArrowFunctionExpression:not(:has(ThisExpression))',
				message: 'Arrow function is allowed only when lexical `this` is required. Use function() { ... } instead.',
			}],
			'object-shorthand': ['error', 'always', {
				avoidQuotes: true,
				avoidExplicitReturnArrows: true,
			}],

			'@typescript-eslint/consistent-type-imports': 'error',

			'import-x/no-default-export': 'error',
			'import-x/order': ['error', {
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
					'object',
				],
				pathGroups: [
					{ pattern: '@/**', group: 'internal' },

					{ pattern: '~/**', group: 'internal', position: 'before' },
					{ pattern: '~/api/**', group: 'internal', position: 'before' },
					{ pattern: '~/domain/**', group: 'internal', position: 'before' },
					{ pattern: '~/i18n/**', group: 'internal', position: 'before' },
					{ pattern: '~/hooks/**', group: 'internal', position: 'before' },
					{ pattern: '~/navigation/**', group: 'internal', position: 'before' },
					{ pattern: '~/components/**', group: 'internal', position: 'before' },
					{ pattern: '~/utils/**', group: 'internal', position: 'after' },
					{ pattern: '~/test-utils/**', group: 'internal', position: 'after' },
				],
				pathGroupsExcludedImportTypes: ['builtin'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			}],

			'@stylistic/arrow-parens': ['error', 'as-needed'],
			'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
			'@stylistic/indent': ['error', 'tab', { SwitchCase: 0 }],
			'@stylistic/jsx-max-props-per-line': ['error', {
				maximum: {
					single: 2,
					multi: 1,
				},
			}],
			'@stylistic/jsx-quotes': [`error`, 'prefer-single'],
			'@stylistic/jsx-sort-props': ['error', {
				ignoreCase: true,
				callbacksLast: true,
				reservedFirst: true,
			},],
			'@stylistic/no-multi-spaces': ['error', { 
				ignoreEOLComments: true,
			}],
			'@stylistic/no-trailing-spaces': ['error', {
				ignoreComments: true,
			}],
			'@stylistic/object-property-newline': ['error', {
				allowAllPropertiesOnSameLine: true,
			}],
			'@stylistic/operator-linebreak': ['error', 'before', {
				overrides: {
					'=': 'ignore',  // Allow `type Foo =` to end a line so union members below can align like `| 'a'`
				},
			}],
			'@stylistic/space-before-function-paren': ['error', {
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always',
			}],
		},
		settings: {
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					alwaysTryTypes: true,
					project: './tsconfig.json',
				}),
			],
		},
	},
	{
		// @vanilla-extract/css
		files: ['**/*.css.ts'],
		rules: {
			'no-restricted-syntax': 'off',

			'@stylistic/quote-props': ['error', 'as-needed'],
		},
	},
	{
		files: ['**/*.{bench,spec,test}.{ts,tsx}'],
		extends: [
			vitest.configs.recommended,
		],
		plugins: {
			vitest,
		},
		languageOptions: {
			globals: vitest.environments.env.globals,
		},
		rules: {
			'no-restricted-syntax': 'off',

			'@typescript-eslint/unbound-method': 'off'
		},
		settings: {
			vitest: {
				typecheck: true,
			},
		},
	},
	{
		files: ['*.config.ts'],
		rules: {
			'no-restricted-syntax': 'off',

			'import-x/no-default-export': 'off',
		},
	},
])
