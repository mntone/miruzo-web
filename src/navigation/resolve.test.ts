import { createEntryFromRoute } from './entry'
import { buildUrlFromEntry, resolveSnapshotFromLocation, resolveSnapshotFromState } from './resolve'
import type { NavigationEntry, NavigationRoute, NavigationRoutes, NavigationStackComponent } from './types'

function createRouteFixtures() {
	const Alpha = (() => null) as NavigationStackComponent
	const Beta = (() => null) as NavigationStackComponent<{ params: { id: number } }>

	const routes = [
		{
			id: 'alpha',
			component: Alpha,
			fromPath(path) {
				return path === '/' ? true : undefined
			},
			toPath() {
				return '/'
			},
		},
		{
			id: 'beta',
			component: Beta,
			fromPath(path) {
				if (!path.startsWith('/beta/')) {
					return undefined
				}
				const integerString = decodeURIComponent(path.slice('/beta/'.length))
				const integer = Number(integerString)
				if (Number.isInteger(integer)) {
					return { id: integer }
				}
				return undefined
			},
			toPath(params: { id: number }) {
				return `/beta/${params.id}`
			},
		},
	] as const satisfies NavigationRoutes

	const routesById = new Map<string, NavigationRoute>(
		routes.map(route => [route.id, route]),
	)

	return { routes, routesById }
}

describe('resolveSnapshotFromLocation', () => {
	it('normalizes empty paths to root', () => {
		const { routes } = createRouteFixtures()
		const snapshot = resolveSnapshotFromLocation(
			{ pathname: '' },
			{ routes },
		)

		if (!snapshot) {
			throw Error('Expected snapshot to be defined')
		}

		expect(snapshot.routeId).toBe('alpha')
		expect(snapshot.root).toBe(true)
		expect(snapshot.params).toBeUndefined()
		expect(Object.prototype.hasOwnProperty.call(snapshot, 'params')).toBe(false)
	})

	it('normalizes trailing slashes', () => {
		const { routes } = createRouteFixtures()
		const snapshot = resolveSnapshotFromLocation(
			{ pathname: '/beta/42/' },
			{ routes },
		)

		if (!snapshot) {
			throw Error('Expected snapshot to be defined')
		}

		expect(snapshot.routeId).toBe('beta')
		expect(snapshot.root).toBe(true)
		expect(snapshot.params).toEqual({ id: 42 })
	})

	it('returns undefined for unknown paths', () => {
		const { routes } = createRouteFixtures()

		expect(resolveSnapshotFromLocation(
			{ pathname: '/unknown' },
			{ routes },
		)).toBeUndefined()
	})
})

describe('buildUrlFromEntry', () => {
	it('builds url for a route with params', () => {
		const { routes, routesById } = createRouteFixtures()
		const entry = createEntryFromRoute(routes[1], { id: 42 })
		const url = buildUrlFromEntry(entry, {
			getRouteById(id) {
				return routesById.get(id)
			},
		})

		expect(url).toBe('/beta/42')
	})

	it('builds url for a route without params', () => {
		const { routes, routesById } = createRouteFixtures()
		const entry = createEntryFromRoute(routes[0])
		const url = buildUrlFromEntry(entry, {
			getRouteById(id) {
				return routesById.get(id)
			},
		})

		expect(url).toBe('/')
	})

	it('returns undefined when the route is missing', () => {
		const { routes, routesById } = createRouteFixtures()
		const entry: NavigationEntry = {
			key: 'missing',
			component: routes[0].component,
			routeId: 'missing',
		}
		const url = buildUrlFromEntry(entry, {
			getRouteById(id) {
				return routesById.get(id)
			},
		})

		expect(url).toBeUndefined()
	})
})

describe('resolveSnapshotFromState', () => {
	it('returns the snapshot when routeId is present', () => {
		const state = { routeId: 'alpha' }

		expect(resolveSnapshotFromState(state)).toBe(state)
	})

	it('ignores non-object values', () => {
		expect(resolveSnapshotFromState(null)).toBeUndefined()
		expect(resolveSnapshotFromState(123)).toBeUndefined()
	})

	it('requires an own routeId property', () => {
		const state: Record<string, unknown> = {}
		Object.setPrototypeOf(state, { routeId: 'alpha' })

		expect(resolveSnapshotFromState(state)).toBeUndefined()
	})
})
