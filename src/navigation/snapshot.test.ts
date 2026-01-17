import { createEntryFromRoute } from './entry'
import type { NavigationStackComponent } from './helpers'
import { createEntryFromSnapshot, createSnapshotFromEntry } from './snapshot'
import type { NavigationRoute, NavigationRoutes, NavigationSnapshot } from './types'

function createRouteFixtures() {
	const Alpha = (() => null) as NavigationStackComponent
	const Beta = (() => null) as NavigationStackComponent

	const routes = [
		{
			id: 'alpha',
			component: Alpha,
		},
		{
			id: 'beta',
			component: Beta,
		},
	] as const satisfies NavigationRoutes

	const routesById = new Map<string, NavigationRoute>(
		routes.map(route => [route.id, route]),
	)
	return { routes, routesById }
}

describe('createEntryFromSnapshot', () => {
	it('builds entry with params', () => {
		const { routes, routesById } = createRouteFixtures()

		const snapshot: NavigationSnapshot = {
			root: true,
			routeId: 'alpha',
		}

		const entry = createEntryFromSnapshot(snapshot, {
			createEntryFromRoute,
			getRouteById(id) {
				return routesById.get(id)
			},
		})
		if (entry === undefined) {
			throw new Error('Expected entries to be created')
		}

		expect(entry.component).toBe(routes[0].component)
		expect(entry.params).toBeUndefined()
		expect(entry.routeId).toBe('alpha')
	})

	it('builds entry without params when undefined', () => {
		const { routes, routesById } = createRouteFixtures()

		const snapshot: NavigationSnapshot = {
			routeId: 'beta',
			params: { id: 1 },
		}

		const entry = createEntryFromSnapshot(snapshot, {
			createEntryFromRoute,
			getRouteById(id) {
				return routesById.get(id)
			},
		})
		if (entry === undefined) {
			throw new Error('Expected entries to be created')
		}

		expect(entry.component).toBe(routes[1].component)
		expect(entry.params).toEqual({ id: 1 })
		expect(entry.routeId).toBe('beta')
	})

	it('returns undefined when a route is missing', () => {
		const { routesById } = createRouteFixtures()
		const snapshot: NavigationSnapshot = {
			root: true,
			routeId: 'missing',
		}

		const entry = createEntryFromSnapshot(snapshot, {
			createEntryFromRoute,
			getRouteById(id) {
				return routesById.get(id)
			},
		})

		expect(entry).toBeUndefined()
	})
})

describe('createSnapshotFromEntry', () => {
	it('builds snapshots with params', () => {
		const { routes } = createRouteFixtures()

		const entry = createEntryFromRoute(routes[1], { id: 2 })

		const snapshot = createSnapshotFromEntry(entry)
		expect(snapshot.params).toEqual({ id: 2 })
		expect(snapshot.root).toBeUndefined()
		expect(snapshot.routeId).toBe('beta')
	})

	it('builds snapshots without params when undefined', () => {
		const { routes } = createRouteFixtures()

		const entry = createEntryFromRoute(routes[0])

		const snapshot = createSnapshotFromEntry(entry, true)
		expect(Object.prototype.hasOwnProperty.call(snapshot, 'params')).toBe(false)
		expect(snapshot.root).toBe(true)
		expect(snapshot.routeId).toBe('alpha')
	})
})
