import type { NavigationEntry, NavigationRoute } from './types'

export function createEntryFromRoute(route: NavigationRoute, params?: unknown): NavigationEntry {
	return {
		key: `${Date.now()}`,
		component: route.component,
		routeId: route.id,
		params,
	} as const
}
