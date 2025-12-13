export function toDate(date: string): Date {
	return new Date(date)
}

export function toDateOptional(date: string | undefined): Date | undefined {
	return date ? toDate(date) : undefined
}

export function mapRecord<T, U>(
	src: Record<string, T>,
	mapFn: (x: T) => U,
): Record<string, U> {
	const dst: Record<string, U> = {}
	for (const key in src) {
		dst[key] = mapFn(src[key])
	}
	return dst
}
