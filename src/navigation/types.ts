import type { Accessor, JSX } from 'solid-js'

import type { NavigationParamsOptional, NavigationParamsRequired, NavigationStackComponent } from './helpers'

export type { NavigationParamsOptional, NavigationParamsRequired, NavigationStackComponent } from './helpers'

export interface NavigationRoute {
	id: string
	component: NavigationStackComponent
}
export type NavigationRoutes = readonly NavigationRoute[]

export type NavigationPageRouteId<Routes extends readonly NavigationRoute[]> = Routes[number]['id']

export type NavigationKey = string

export interface NavigationEntry {
	readonly key: NavigationKey
	readonly component: NavigationStackComponent
	readonly params?: unknown
	readonly routeId: string
}
export type NavigationEntries = readonly NavigationEntry[]

export interface NavigationStackContextValue {
	canPop: Accessor<boolean>
	getEntries: Accessor<NavigationEntries>

	push<C extends NavigationStackComponent>(this: void, component: C, params: NavigationParamsRequired<C>): void
	push<C extends NavigationStackComponent>(this: void, component: C, params?: NavigationParamsOptional<C>): void
	replace<C extends NavigationStackComponent>(this: void, component: C, params: NavigationParamsRequired<C>): void
	replace<C extends NavigationStackComponent>(this: void, component: C, params?: NavigationParamsOptional<C>): void
	pop(this: void): void
}

export interface NavigationStackProviderProps {
	readonly children: JSX.Element
	readonly initialRouteId?: string
	readonly routes: NavigationRoutes
}
