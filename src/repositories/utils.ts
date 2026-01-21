export function deleteOwnProperty<T extends object>(
	obj: T,
	key: keyof T,
): void {
	if (Object.hasOwn(obj, key)) {
		delete obj[key]
	}
}
