import type { NavigationEntry, NavigationRoute } from './types'

export function createEntryFromRoute(route: NavigationRoute, params?: unknown): NavigationEntry {
	const options = route.component.options
	return {
		key: Date.now().toString(),
		component: route.component,
		routeId: route.id,
		params,
		...options,
		overlay: route.type === 'overlay' || (options?.overlay ?? false),
	} as const
}
