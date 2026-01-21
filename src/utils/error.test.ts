import { normalizeError } from './error'

describe('normalizeError', function() {
	const hasDOMException = typeof DOMException !== 'undefined'

	beforeEach(function() {
		if (hasDOMException) {
			return
		}
		class DOMExceptionStub extends Error {}
		vi.stubGlobal('DOMException', DOMExceptionStub)
	})

	afterEach(function() {
		if (hasDOMException) {
			return
		}
		vi.unstubAllGlobals()
	})

	it('returns Error instances as-is', function() {
		const err = Error('boom')
		expect(normalizeError(err)).toBe(err)
	})

	it('handles DOMException messages', function() {
		const err = new DOMException('boom')
		const next = normalizeError(err)
		expect(next).toBeInstanceOf(Error)
		expect(next.message).toBe('boom')
	})

	it('stringifies non-error values', function() {
		const next = normalizeError(42)
		expect(next.message).toBe('42')
	})
})
