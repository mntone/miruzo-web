import { normalizeError } from '~/utils/error'

export function reportAndIgnore(setError: (err: Error) => void) {
	return function(err: unknown): void {
		const next = normalizeError(err)
		setError(next)
	}
}
