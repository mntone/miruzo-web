import type { Accessor, JSX } from 'solid-js'

import type { NavigationDriver } from './drivers/types'
import type { NavigationParamsOptional, NavigationParamsRequired, NavigationStackComponent } from './helpers'

export type { NavigationStackComponent } from './helpers'

type RouteParams<C extends NavigationStackComponent>
	= [NavigationParamsRequired<C>] extends [never]
		? NavigationParamsOptional<C>
		: NavigationParamsRequired<C>

type NavigationRouteSpecRequired<C extends NavigationStackComponent> = {
	fromPath(path: string): RouteParams<C> | undefined
	toPath(params: RouteParams<C>): string
}

type NavigationRouteSpecOptional = {
	fromPath(path: string): true | undefined
	toPath(): string
}

type NavigationRouteSpec<C extends NavigationStackComponent>
	= [RouteParams<C>] extends [never]
		? NavigationRouteSpecOptional
		: NavigationRouteSpecRequired<C>

export type NavigationRoute<C extends NavigationStackComponent = NavigationStackComponent> = {
	id: string
	component: C
} & NavigationRouteSpec<C>
export type NavigationRoutes = readonly NavigationRoute[]

export type NavigationPageRouteId<Routes extends readonly NavigationRoute[]> = Routes[number]['id']

export interface NavigationLocation {
	readonly pathname: string
}

export interface NavigationSnapshot {
	readonly params?: unknown
	readonly root?: true
	readonly routeId: string
}

export type NavigationKey = string

export interface NavigationEntry {
	readonly key: NavigationKey
	readonly component: NavigationStackComponent
	readonly params?: unknown
	readonly routeId: string
}

export interface NavigationStackContextValue {
	canPop: Accessor<boolean>
	getEntry: Accessor<NavigationEntry | undefined>
	getRouteById(this: void, id: string): NavigationRoute | undefined
	getRouteByComponent(this: void, component: NavigationStackComponent): NavigationRoute

	push<C extends NavigationStackComponent>(this: void, component: C, params: NavigationParamsRequired<C>): void
	push<C extends NavigationStackComponent>(this: void, component: C, params?: NavigationParamsOptional<C>): void
	replace<C extends NavigationStackComponent>(this: void, component: C, params: NavigationParamsRequired<C>): void
	replace<C extends NavigationStackComponent>(this: void, component: C, params?: NavigationParamsOptional<C>): void
	pop(this: void): void
}

export interface NavigationStackProviderProps {
	readonly children: JSX.Element
	readonly driver: NavigationDriver
	readonly initialRouteId?: string
	readonly routes: NavigationRoutes
}
