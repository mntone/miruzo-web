import { formatNumeralMessage, formatWithArgument } from './format'

describe('formatWithArgument', () => {
	it('replaces indexed placeholders', () => {
		expect(formatWithArgument('message: {0}', ['hello'])).toBe('message: hello')
	})

	it('leaves placeholders without a matching argument', () => {
		expect(formatWithArgument('{0} {1} {2}', ['a', 'b'])).toBe('a b {2}')
	})

	it('replaces repeated placeholders', () => {
		expect(formatWithArgument('{0} and {0}', ['echo'])).toBe('echo and echo')
	})

	it('ignores non-numeric placeholders', () => {
		expect(formatWithArgument('{a} {0}', ['one'])).toBe('{a} one')
	})

	it('returns template when no args are provided', () => {
		expect(formatWithArgument('message: {0}', [])).toBe('message: {0}')
	})
})

describe('formatNumeralMessage', () => {
	it('replaces numeral placeholders', () => {
		expect(formatNumeralMessage('Viewed {0} times', 3, String)).toBe('Viewed 3 times')
	})

	it('reuses formatted value for repeated placeholders', () => {
		let calls = 0
		function formatNumber(value: number): string {
			calls += 1
			return `#${value}`
		}

		expect(formatNumeralMessage('{0} {0}', 12, formatNumber)).toBe('#12 #12')
		expect(calls).toBe(1)
	})
})
