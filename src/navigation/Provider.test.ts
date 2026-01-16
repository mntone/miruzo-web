import { createComponent, createRoot, useContext } from 'solid-js'

import type { Writable } from '~/@types/utils'

import { NavigationStackContext, NavigationStackProvider } from './Provider'
import type { NavigationRoutes, NavigationStackComponent, NavigationStackContextValue, NavigationStackProviderProps } from './types'

interface SetupResult {
	readonly context: NavigationStackContextValue
	readonly dispose: () => void
}

function createRoutesFromComponents(components: NavigationStackComponent[]): NavigationRoutes {
	return components.map(component => {
		return {
			id: component.name,
			type: 'page',
			component,
		}
	})
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

		const providerProps: Writable<NavigationStackProviderProps> = {
			get children() {
				return createComponent(Capture, {})
			},
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

		const entries = context.getEntries()
		expect(entries).toHaveLength(1)
		expect(entries[0].component).toBe(Initial)

		dispose()
	})

	it('reports canPop as false on an empty stack', () => {
		const { context, dispose } = setupProvider([])

		expect(context.getEntries()).toHaveLength(0)
		expect(context.canPop()).toBe(false)

		dispose()
	})

	it('pushes items with params and options', () => {
		type DetailParams = { id: number }
		const Detail: NavigationStackComponent<{ params: DetailParams }> = (props: { params: DetailParams }) => {
			void props
			return null
		}
		Detail.options = { overlay: true }

		const routes = createRoutesFromComponents([Detail])
		const { context, dispose } = setupProvider(routes, null)

		const params = { id: 123 }
		context.push(Detail, params)

		const entries = context.getEntries()
		expect(entries).toHaveLength(1)
		expect(entries[0].component).toBe(Detail)
		expect(entries[0].params).toEqual(params)
		expect(entries[0].overlay).toBe(true)

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

		const entries = context.getEntries()
		expect(entries).toHaveLength(2)
		expect(entries[0].component).toBe(First)
		expect(entries[1].component).toBe(Replacement)

		dispose()
	})

	it('pops items and updates canPop', () => {
		const First = (() => null) as NavigationStackComponent
		const Second = (() => null) as NavigationStackComponent

		const routes = createRoutesFromComponents([First, Second])
		const { context, dispose } = setupProvider(routes, null)

		context.push(First)
		expect(context.canPop()).toBe(false)

		context.push(Second)
		expect(context.canPop()).toBe(true)

		context.pop()
		expect(context.getEntries()).toHaveLength(1)
		expect(context.canPop()).toBe(false)

		dispose()
	})
})
