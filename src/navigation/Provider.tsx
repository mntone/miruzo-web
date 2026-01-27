import { batch, createContext, createSignal, onCleanup, onMount } from 'solid-js'

import { createEntryFromRoute } from './entry'
import type { NavigationParamsOptional, NavigationParamsRequired } from './helpers'
import { createRouteRegistry } from './registry'
import { buildUrlFromEntry, resolveSnapshotFromLocation, resolveSnapshotFromState } from './resolve'
import { createEntryFromSnapshot, createSnapshotFromEntry } from './snapshot'
import type {
	NavigationEntry,
	NavigationStackComponent,
	NavigationStackContextValue,
	NavigationStackProviderProps,
	NavigationTransitionInfo,
} from './types'

function getUndefined(): undefined {
	return undefined
}

const emptyContext: NavigationStackContextValue = {
	canPop() {
		return false
	},
	getEntry: getUndefined,
	getRouteById: getUndefined,
	getRouteByComponent() {
		throw Error('No routes registered')
	},
	getTransitionInfo() {
		return {
			action: 'replace',
		}
	},

	push() {},
	replace() {},
	pop() {},
} as const

export const NavigationStackContext = createContext<NavigationStackContextValue>(emptyContext)

export function NavigationStackProvider(props: NavigationStackProviderProps) {
	const {
		routes,
		initialRoute,
		getRouteById,
		getRouteByComponent,
	// eslint-disable-next-line solid/reactivity
	} = createRouteRegistry(props.routes, props.initialRouteId)

	function _buildUrlFromEntry(entry: NavigationEntry): string | undefined {
		return buildUrlFromEntry(entry, { getRouteById })
	}

	const [getEntry, setEntry] = createSignal<NavigationEntry | undefined>(undefined)
	const [isRoot, setIsRoot] = createSignal<boolean>(true)
	const [canPop, setCanPop] = createSignal<boolean>(false)
	const [getTransitionInfo, setTransitionInfo] = createSignal<NavigationTransitionInfo>({
		action: 'restore',
	})

	function dispatchEntry(entry: NavigationEntry | undefined, root: boolean, info: NavigationTransitionInfo): void {
		batch(function() {
			setEntry(entry)
			setIsRoot(root)
			setCanPop(!root && props.driver.canPop())
			setTransitionInfo(info)
		})
	}

	function restoreEntry(state: unknown, initialState?: true): void {
		const info: NavigationTransitionInfo = {
			action: initialState === true ? 'restore' : 'pop',
		}

		// Try to restore from state
		const snapshot = resolveSnapshotFromState(state)
		if (snapshot !== undefined) {
			const entry = createEntryFromSnapshot(snapshot, {
				createEntryFromRoute,
				getRouteById,
			})
			if (entry !== undefined) {
				dispatchEntry(entry, snapshot?.root === true, info)
				return
			}
		}

		// Try to restore from location
		const locationSnapshot = resolveSnapshotFromLocation(props.driver.location, { routes })
		if (locationSnapshot !== undefined) {
			const entry = createEntryFromSnapshot(locationSnapshot, {
				createEntryFromRoute,
				getRouteById,
			})
			if (entry !== undefined) {
				props.driver.replace(
					createSnapshotFromEntry(entry, true),
					_buildUrlFromEntry(entry),
				)
				dispatchEntry(entry, locationSnapshot?.root === true, info)
				return
			}
		}

		// Restore to initial route
		if (initialState === true && initialRoute !== null) {
			const entry = createEntryFromRoute(initialRoute)
			props.driver.replace(
				createSnapshotFromEntry(entry, true),
				_buildUrlFromEntry(entry),
			)
			dispatchEntry(entry, true, info)
			return
		}

		// Unable to restore
		if (import.meta.env.DEV) {
			console.error('Invalid navigation state', state)
		}
		if (initialState !== true) {
			dispatchEntry(undefined, true, info)
		}
	}

	function push<C extends NavigationStackComponent>(component: C, params: NavigationParamsRequired<C>): void
	function push<C extends NavigationStackComponent>(component: C, params?: NavigationParamsOptional<C>): void
	function push(component: NavigationStackComponent, params?: unknown): void {
		const route = getRouteByComponent(component)
		const entry = createEntryFromRoute(route, params)
		props.driver.push(
			createSnapshotFromEntry(entry),
			_buildUrlFromEntry(entry),
		)

		dispatchEntry(entry, false, {
			action: 'push',
		})
	}

	function replace<C extends NavigationStackComponent>(component: C, params: NavigationParamsRequired<C>): void
	function replace<C extends NavigationStackComponent>(component: C, params?: NavigationParamsOptional<C>): void
	function replace(component: NavigationStackComponent, params?: unknown): void {
		const route = getRouteByComponent(component)
		const entry = createEntryFromRoute(route, params)
		const root = isRoot()
		props.driver.replace(
			createSnapshotFromEntry(entry, root ? true : undefined),
			_buildUrlFromEntry(entry),
		)

		dispatchEntry(entry, root, {
			action: 'replace',
		})
	}

	function pop() {
		if (canPop()) {
			props.driver.pop()
		}
	}

	onMount(function() {
		restoreEntry(props.driver.state, true)
		onCleanup(props.driver.onPop(restoreEntry))
	})

	const api: NavigationStackContextValue = {
		getEntry,
		getRouteById,
		getRouteByComponent,
		getTransitionInfo,
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
