import { createContext, createMemo, createSignal } from 'solid-js'

import { createEntryFromRoute } from './entry'
import { createRouteRegistry } from './registry'
import type {
	NavigationEntries,
	NavigationParamsOptional,
	NavigationParamsRequired,
	NavigationStackComponent,
	NavigationStackContextValue,
	NavigationStackProviderProps,
} from './types'

const emptyContext: NavigationStackContextValue = {
	canPop() {
		return false
	},
	getEntries() {
		return []
	},

	push() {},
	replace() {},
	pop() {},
} as const

export const NavigationStackContext = createContext<NavigationStackContextValue>(emptyContext)

export function NavigationStackProvider(props: NavigationStackProviderProps) {
	const {
		initialRoute,
		getRouteByComponent,
	// eslint-disable-next-line solid/reactivity
	} = createRouteRegistry(props.routes, props.initialRouteId)

	const [getEntries, setEntries] = createSignal<NavigationEntries>(
		initialRoute !== null ? [createEntryFromRoute(initialRoute)] : [],
	)

	function push<C extends NavigationStackComponent>(component: C, params: NavigationParamsRequired<C>): void
	function push<C extends NavigationStackComponent>(component: C, params?: NavigationParamsOptional<C>): void
	function push(component: NavigationStackComponent, params?: unknown): void {
		const route = getRouteByComponent(component)
		setEntries(function(prevEntry) {
			const entry = createEntryFromRoute(route, params)
			const entries = prevEntry.concat(entry)
			return entries
		})
	}

	function replace<C extends NavigationStackComponent>(component: C, params: NavigationParamsRequired<C>): void
	function replace<C extends NavigationStackComponent>(component: C, params?: NavigationParamsOptional<C>): void
	function replace(component: NavigationStackComponent, params?: unknown): void {
		const route = getRouteByComponent(component)
		setEntries(function(prevEntry) {
			const entry = createEntryFromRoute(route, params)
			const entries = prevEntry.slice(0, -1).concat(entry)
			return entries
		})
	}

	const canPop = createMemo(function() {
		return getEntries().length > 1
	})

	function pop() {
		if (getEntries().length <= 1) {
			if (import.meta.env.DEV) {
				throw Error('pop() requires at least 2 items')
			}
			return
		}

		setEntries(function(prevEntry) {
			const head = prevEntry.slice(0, -1)
			return head
		})
	}

	const api: NavigationStackContextValue = {
		getEntries,
		push,
		replace,
		canPop,
		pop,
	}

	return (
		<NavigationStackContext.Provider value={api}>
			{props.children}
		</NavigationStackContext.Provider>
	)
}
