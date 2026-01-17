import type { Writable } from '~/@types/utils'

import type { NavigationRoute, NavigationEntry, NavigationSnapshot } from './types'

export function createEntryFromSnapshot(
	snapshot: NavigationSnapshot,
	options: {
		createEntryFromRoute(this: void, route: NavigationRoute, params?: unknown): NavigationEntry
		getRouteById(this: void, id: string): NavigationRoute | undefined
	},
): NavigationEntry | undefined {
	const route = options.getRouteById(snapshot.routeId)
	if (route === undefined) {
		return undefined
	}

	const entry = options.createEntryFromRoute(route, snapshot.params)
	return entry
}

export function createSnapshotFromEntry(entry: NavigationEntry, root?: true): NavigationSnapshot {
	const snapshot: Writable<NavigationSnapshot> = {
		routeId: entry.routeId,
	}
	if (root === true) {
		snapshot.root = true
	}
	if (entry.params !== undefined) {
		snapshot.params = entry.params
	}
	return snapshot
}
