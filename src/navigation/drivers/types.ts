import type { NavigationLocation, NavigationSnapshot } from '../types'

export interface NavigationDriver {
	readonly location: NavigationLocation
	readonly state: unknown

	push(this: void, snapshot: NavigationSnapshot, url?: string): void
	replace(this: void, snapshot: NavigationSnapshot, url?: string): void
	pop(this: void): void
	canPop(this: void): boolean
	onPop(this: void, handler: (state: unknown) => void): () => void
}
