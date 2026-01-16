import type { NavigationPageRoute, NavigationRoute, NavigationRoutes, NavigationStackComponent } from './types'

export interface NavigationRouteRegistry {
	readonly initialRoute: NavigationPageRoute | null

	getRouteByComponent(this: void, component: NavigationStackComponent): NavigationRoute
}

export function createRouteRegistry(
	routes: NavigationRoutes,
	initialRouteId: string | undefined,
): NavigationRouteRegistry {
	const routesById = new Map<string, NavigationRoute>()
	const routesByComponent = new Map<NavigationStackComponent, NavigationRoute>()

	for (const route of routes) {
		if (routesById.has(route.id)) {
			throw Error(`Duplicate navigation route id: ${route.id}`)
		}
		routesById.set(route.id, route)

		if (routesByComponent.has(route.component)) {
			throw Error(`Duplicate navigation route component for id: ${route.id}`)
		}
		routesByComponent.set(route.component, route)
	}

	let initialRoute: NavigationPageRoute | null = null
	if (initialRouteId !== undefined) {
		const route = routesById.get(initialRouteId)
		if (route === undefined || route.type !== 'page') {
			throw Error(`Initial route must be a page route: ${initialRouteId}`)
		}

		initialRoute = route
	}

	return {
		initialRoute,

		getRouteByComponent(component) {
			const route = routesByComponent.get(component)
			if (route === undefined) {
				throw Error('Route not registered for component')
			}

			return route
		},
	} as const
}
