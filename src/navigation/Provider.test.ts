import { createComponent, createRoot, useContext } from 'solid-js'

import type { Writable } from '~/@types/utils'

import type { NavigationDriver } from './drivers/types'
import { NavigationStackContext, NavigationStackProvider } from './Provider'
import type { NavigationRoutes, NavigationStackComponent, NavigationStackContextValue, NavigationStackProviderProps } from './types'

interface SetupResult {
	readonly context: NavigationStackContextValue
	readonly dispose: () => void
}

function createRoutesFromComponents(components: NavigationStackComponent[]): NavigationRoutes {
	return components.map(component => {
		const defaultPath = '/' + component.name.toLowerCase()
		return {
			id: component.name,
			component,
			toPath() {
				return defaultPath
			},
			fromPath(path) {
				return path === defaultPath ? true : undefined
			},
		}
	})
}

function createMockDriver(): NavigationDriver {
	let pathname = '/'
	let state: unknown
	const listeners = new Set<(state: unknown) => void>()
	const states: unknown[] = []
	const urls: (string | undefined)[] = []

	function updateLocation(url: string | undefined) {
		if (!url) {
			return
		}
		if (url.startsWith('http://') || url.startsWith('https://')) {
			pathname = new URL(url).pathname
		} else {
			pathname = url
		}
	}

	return {
		get location() {
			return { pathname }
		},
		get state() {
			return state
		},
		push(nextState, url) {
			states.push(nextState)
			urls.push(url)
			state = nextState
			updateLocation(url)
		},
		replace(nextState, url) {
			if (states.length === 0) {
				states.push(nextState)
				urls.push(url)
			} else {
				states[states.length - 1] = nextState
				urls[urls.length - 1] = url
			}
			state = nextState
			updateLocation(url)
		},
		pop() {
			if (states.length === 0) {
				return
			}
			states.pop()
			urls.pop()
			state = states[states.length - 1]
			updateLocation(urls[urls.length - 1])
			for (const listener of listeners) {
				listener(state)
			}
		},
		canPop() {
			return states.length > 1
		},
		onPop(handler) {
			listeners.add(handler)
			return function() {
				listeners.delete(handler)
			}
		},
	}
}

function setupProvider(
	routes: NavigationRoutes,
	initialRouteId?: string | null,
): SetupResult {
	let context: NavigationStackContextValue | undefined
	let dispose: () => void = () => {}

	createRoot(function(disposeFn) {
		dispose = disposeFn

		function Capture() {
			context = useContext(NavigationStackContext)
			return null
		}

		const driver = createMockDriver()
		const providerProps: Writable<NavigationStackProviderProps> = {
			get children() {
				return createComponent(Capture, {})
			},
			driver,
			routes,
		}
		if (initialRouteId !== undefined) {
			if (initialRouteId !== null) {
				providerProps.initialRouteId = initialRouteId
			}
		} else {
			const firstRouteId = routes.at(0)?.id
			if (firstRouteId !== undefined) {
				providerProps.initialRouteId = firstRouteId
			}
		}

		createComponent(NavigationStackProvider, providerProps)
	})

	if (!context) {
		throw new Error('NavigationStackContext was not captured')
	}

	return { context, dispose } as const
}

describe('NavigationStackProvider', () => {
	it('initializes with the initial route', () => {
		const Initial = (() => null) as NavigationStackComponent
		const routes = createRoutesFromComponents([Initial])
		const { context, dispose } = setupProvider(routes)

		const entry = context.getEntry()
		if (entry === undefined) {
			throw new Error('Expected entry to be defined')
		}
		expect(entry.component).toBe(Initial)

		dispose()
	})

	it('reports canPop as false on an empty stack', () => {
		const { context, dispose } = setupProvider([])

		expect(context.getEntry()).toBeUndefined()
		expect(context.canPop()).toBe(false)

		dispose()
	})

	it('pushes items with params', () => {
		type DetailParams = { id: number }
		const Detail: NavigationStackComponent<{ params: DetailParams }> = (props: { params: DetailParams }) => {
			void props
			return null
		}

		const routes = createRoutesFromComponents([Detail])
		const { context, dispose } = setupProvider(routes, null)

		const params = { id: 123 }
		context.push(Detail, params)

		const entry = context.getEntry()
		if (entry === undefined) {
			throw new Error('Expected entry to be defined')
		}
		expect(entry.component).toBe(Detail)
		expect(entry.params).toEqual(params)

		dispose()
	})

	it('replaces the top item while keeping the rest', () => {
		const First = (() => null) as NavigationStackComponent
		const Second = (() => null) as NavigationStackComponent
		const Replacement = (() => null) as NavigationStackComponent

		const routes = createRoutesFromComponents([First, Second, Replacement])
		const { context, dispose } = setupProvider(routes, null)

		context.push(First)
		context.push(Second)
		context.replace(Replacement)
		expect(context.canPop()).toBe(true)
		expect(context.getEntry()?.component).toBe(Replacement)

		context.pop()
		expect(context.canPop()).toBe(false)
		expect(context.getEntry()?.component).toBe(First)

		dispose()
	})

	it('pops items and updates canPop', () => {
		const First = (() => null) as NavigationStackComponent
		const Second = (() => null) as NavigationStackComponent

		const routes = createRoutesFromComponents([First, Second])
		const { context, dispose } = setupProvider(routes, null)

		context.push(First)
		expect(context.canPop()).toBe(false)
		expect(context.getEntry()?.component).toBe(First)

		context.push(Second)
		expect(context.canPop()).toBe(true)
		expect(context.getEntry()?.component).toBe(Second)

		context.pop()
		expect(context.canPop()).toBe(false)
		expect(context.getEntry()?.component).toBe(First)

		dispose()
	})
})
