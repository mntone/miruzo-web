export function normalizeError(err: unknown): Error {
	if (err instanceof Error) {
		return err
	}
	if (err instanceof DOMException) {
		return Error(err.message)
	}
	return Error(String(err))
}
