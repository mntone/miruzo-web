export function hasOwn<T extends object, K extends PropertyKey>(
	obj: T,
	key: K,
): obj is T & Record<K, unknown> {
	return Object.hasOwn
		? Object.hasOwn(obj, key)
		: Object.prototype.hasOwnProperty.call(obj, key)
}

export function deleteOwnProperty<T extends object>(
	obj: T,
	key: keyof T,
): void {
	if (hasOwn(obj, key)) {
		delete obj[key]
	}
}
