import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { createHtmlPlugin as html } from 'vite-plugin-html'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [
			tsconfigPaths(),
			solid(),
			vanillaExtractPlugin(),
			mode === 'production' ? html({ minify: true }) : undefined,
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
