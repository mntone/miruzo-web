import type { Accessor, JSX } from 'solid-js'

import type { NavigationOptions, NavigationStackComponent, NavigationParamsOptional, NavigationParamsRequired } from './helpers'

export type { NavigationOptions, NavigationStackComponent, NavigationParamsOptional, NavigationParamsRequired } from './helpers'

export interface NavigationStackItem extends NavigationOptions {
	key: string
	component: NavigationStackComponent
	params?: unknown
}

export interface NavigationStackContextValue {
	canPop: Accessor<boolean>
	getStack: Accessor<NavigationStackItem[]>

	push<C extends NavigationStackComponent>(this: void, component: C, params: NavigationParamsRequired<C>): void
	push<C extends NavigationStackComponent>(this: void, component: C, params?: NavigationParamsOptional<C>): void
	replace<C extends NavigationStackComponent>(this: void, component: C, params: NavigationParamsRequired<C>): void
	replace<C extends NavigationStackComponent>(this: void, component: C, params?: NavigationParamsOptional<C>): void
	pop(this: void): void
}

export interface NavigationStackProviderProps {
	children: JSX.Element
	initialRoute?: NavigationStackComponent
}
