function createAbortError(): DOMException {
	return new DOMException('Aborted', 'AbortError')
}

function delay(milliseconds: number, abortSignal?: AbortSignal): Promise<void> {
	return new Promise(function(resolve, reject) {
		if (abortSignal?.aborted) {
			reject(createAbortError())
			return
		}

		const timeoutId = setTimeout(function() {
			abortSignal?.removeEventListener('abort', onAbort)
			resolve()
		}, milliseconds)

		function onAbort() {
			clearTimeout(timeoutId)
			reject(createAbortError())
		}
		abortSignal?.addEventListener('abort', onAbort, { once: true })
	})
}

export function withDelay<T>(
	delayMilliseconds: number,
	startPromise: () => Promise<T>,
	options?: {
		abortSignal?: AbortSignal
	},
): Promise<T> {
	const abortSignal = options?.abortSignal
	return delay(delayMilliseconds, abortSignal).then(function() {
		if (abortSignal?.aborted) {
			throw createAbortError()
		}
		return startPromise()
	})
}
