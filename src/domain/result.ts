export type Result<T, E> =
	| { status: 'success', value: T }
	| { status: 'failure', error: E }

export const Result = {
	success<T>(value: T): Result<T, never> {
		return { status: 'success', value }
	},

	failure<E>(error: E): Result<never, E> {
		return { status: 'failure', error }
	},
} as const
