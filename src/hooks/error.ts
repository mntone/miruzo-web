export function normalizeError(err: unknown): Error {
	if (err instanceof Error) {
		return err
	}
	if (err instanceof DOMException) {
		return Error(err.message)
	}
	return Error(String(err))
}

export function reportAndIgnore(setError: (err: Error) => void) {
	return function(err: unknown): void {
		const next = normalizeError(err)
		setError(next)
	}
}
