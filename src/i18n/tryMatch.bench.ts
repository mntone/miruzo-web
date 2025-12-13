import { bench } from 'vitest'

import { tryMatch as tryMatchIndexOf } from './config'

// Logic under test -------------------------------------------------

function tryMatchSplit(tag: string, supported: ReadonlySet<string>): string | undefined {
	const parts = tag.toLowerCase().split('-')
	while (parts.length > 0) {
		const reduced = parts.join('-')
		if (supported.has(reduced)) {
			return reduced
		}

		parts.pop()
	}
	return undefined
}

const supportedLocales = new Set(['ja', 'en'] as const)

const testCases = [
	{ tag: 'ja-JP', expected: 'ja' },
	{ tag: 'en-US', expected: 'en' },
	{ tag: 'zh-Hant-TW', expected: undefined },
	{ tag: 'sl-rozaj-biske-1994', expected: undefined },
	{ tag: 'en-US-u-ca-japanese', expected: 'en' },
] as const

// Benchmark --------------------------------------------------------

for (const { tag, expected } of testCases) {
	describe(`tryMatch performance: ${tag}`, () => {
		bench('split()+join()', () => {
			const result = tryMatchSplit(tag, supportedLocales)
			expect(result).toBe(expected)
		})

		bench(`lastIndexOf()+substring() lookup: ${tag}`, () => {
			const result = tryMatchIndexOf(tag, supportedLocales)
			expect(result).toBe(expected)
		})
	})
}
