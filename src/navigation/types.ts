import type { Accessor, JSX } from 'solid-js'

import type { NavigationOptions, NavigationParamsOptional, NavigationParamsRequired, NavigationStackComponent } from './helpers'

export type { NavigationOptions, NavigationParamsOptional, NavigationParamsRequired, NavigationStackComponent } from './helpers'

export interface NavigationPageRoute {
	id: string
	type: 'page'
	component: NavigationStackComponent
}

export interface NavigationOverlayRoute {
	id: string
	type: 'overlay'
	component: NavigationStackComponent
}

export type NavigationRoute = NavigationPageRoute | NavigationOverlayRoute

export type NavigationRoutes = readonly NavigationRoute[]

export type NavigationPageRouteId<Routes extends readonly NavigationRoute[]>
	= Extract<Routes[number], { type: 'page' }>['id']

export interface NavigationEntry extends NavigationOptions {
	readonly key: string
	readonly component: NavigationStackComponent
	readonly routeId: string
	readonly params?: unknown
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
