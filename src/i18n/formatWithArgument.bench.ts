import { bench } from 'vitest'

import { formatWithArgument } from './format'

const testArgs: [string, readonly string[]] = [
	'by {0} · {1} views · {2} likes',
	['mntone', '1200', '12'],
]

function formatWithArgumentManual(template: string, args: readonly string[]): string {
	if (args.length === 0) {
		return template
	}

	const out: string[] = []
	let i = 0
	while (i < template.length) {
		if (template.charCodeAt(i) !== 123) { // '{'
			out.push(template[i])
			i += 1
			continue
		}

		let j = i + 1
		let value = 0
		let hasDigit = false
		while (j < template.length) {
			const code = template.charCodeAt(j)
			if (code >= 48 && code <= 57) {
				value = value * 10 + (code - 48)
				hasDigit = true
				j += 1
				continue
			}
			break
		}

		if (hasDigit && j < template.length && template.charCodeAt(j) === 125) { // '}'
			if (value < args.length) {
				out.push(String(args[value]))
			} else {
				out.push(template.slice(i, j + 1))
			}
			i = j + 1
			continue
		}

		out.push(template[i])
		i += 1
	}

	return out.join('')
}

// Benchmark --------------------------------------------------------

describe('formatWithArgument performance', () => {
	const options = { warmupIterations: 1000, warmupTime: 500 }

	bench('formatWithArgument (replace)', () => {
		const message = formatWithArgument(testArgs[0], testArgs[1])
		expect(message).toBe('by mntone · 1200 views · 12 likes')
	}, options)

	bench('formatWithArgumentManual', () => {
		const message = formatWithArgumentManual(testArgs[0], testArgs[1])
		expect(message).toBe('by mntone · 1200 views · 12 likes')
	}, options)
})
