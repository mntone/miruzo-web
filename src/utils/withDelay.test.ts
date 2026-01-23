import { withDelay } from './withDelay'

describe('withDelay', () => {
	it('resolves after the delay', async () => {
		vi.useFakeTimers()

		let resolved = false
		const promise = withDelay(100, () => Promise.resolve('ok')).then(function(value) {
			resolved = true
			return value
		})

		await Promise.resolve()
		expect(resolved).toBe(false)

		await vi.advanceTimersByTimeAsync(99)
		expect(resolved).toBe(false)

		await vi.advanceTimersByTimeAsync(1)
		expect(resolved).toBe(true)

		await expect(promise).resolves.toBe('ok')

		vi.useRealTimers()
	})

	it('rejects after the delay', async () => {
		vi.useFakeTimers()

		const promise = withDelay(100, () => Promise.reject(Error('boom')))

		// eslint-disable-next-line vitest/valid-expect -- expectation is registered before timers to avoid unhandled rejection; awaited later.
		const expectation = expect(promise).rejects.toThrow('boom')
		await vi.advanceTimersByTimeAsync(100)
		await expectation

		vi.useRealTimers()
	})
})
