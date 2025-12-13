import 'csstype'

declare module 'csstype' {
	interface StandardLonghandProperties {
		cornerShape?: CornerShape
	}

	export type CornerShape =
		| 'round'
		| `superellipse(${number})`
		| 'scoop'
		| 'notch'
		| 'bevel'
}
