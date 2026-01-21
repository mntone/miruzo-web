import type { Writable } from '~/@types/utils'

import type { NavigationEntry, NavigationLocation, NavigationRoute, NavigationRoutes, NavigationSnapshot } from './types'

export function buildUrlFromEntry(
	entry: NavigationEntry,
	options: {
		getRouteById(this: void, id: string): NavigationRoute | undefined
	},
): string | undefined {
	const route = options.getRouteById(entry.routeId)
	return route ? route.toPath(entry?.params) : undefined
}

function normalizePath(path: string): string {
	if (path.length === 0) {
		return '/'
	}
	if (path.length > 1 && path.endsWith('/')) {
		path = path.replace(/\/+$/, '')
		return path.length !== 0 ? path : '/'
	}
	return path
}

export function resolveSnapshotFromLocation(
	location: NavigationLocation,
	options: {
		readonly routes: NavigationRoutes
	},
): NavigationSnapshot | undefined {
	const path = normalizePath(location.pathname)
	for (const route of options.routes) {
		const params = route.fromPath(path)
		if (params !== undefined) {
			const snapshot: Writable<NavigationSnapshot> = {
				root: true,
				routeId: route.id,
			}
			if (params !== true) {
				snapshot.params = params
			}
			return snapshot
		}
	}
	return undefined
}

function isNavigationSnapshot(state: unknown): state is NavigationSnapshot {
	return state != null
		&& typeof state === 'object'
		&& Object.hasOwn(state, 'routeId')
}

export function resolveSnapshotFromState(state: unknown): NavigationSnapshot | undefined {
	return isNavigationSnapshot(state) ? state : undefined
}
