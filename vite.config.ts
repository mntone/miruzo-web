import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { loadEnv } from 'vite'
import csp from 'vite-plugin-csp-guard'
import { createHtmlPlugin as html } from 'vite-plugin-html'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const assetHost = env['VITE_STATIC_ASSET_HOST']
		? env['VITE_STATIC_ASSET_HOST'].trim()
		: '\'self\''

	return {
		plugins: [
			tsconfigPaths(),
			solid(),
			vanillaExtractPlugin(),
			mode === 'production' ? html({ minify: true }) : undefined,
			csp({
				build: {
					sri: true,
				},
				policy: {
					'img-src': [assetHost, 'data:'],
				},
			}),
		],
		build: {
			rollupOptions: {
				output: {
					assetFileNames: 'a/[name]-[hash:3].[ext]',
					chunkFileNames: 'a/[name]-[hash:6].js',
					entryFileNames: 'a/main-[hash:6].js',
				},
			},
		},
		server: {
			port: 3326,
		},
		test: {
			include: [
				'src/**/*.{spec,test}.ts?(x)',
			],
			globals: true,
			environment: 'node',

			pool: 'threads', // require codex
		},
	}
})
