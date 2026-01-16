import type { Component } from 'solid-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NavigationStackComponent<P extends Record<string, unknown> = any> = Component<P>

type ComponentPropsOf<C extends NavigationStackComponent> = C extends Component<infer Props> ? Props : never

type PropsWithRequiredParams<C extends NavigationStackComponent> = ComponentPropsOf<C> extends { params: infer P }
	? undefined extends ComponentPropsOf<C>['params']
		? never
		: P
	: never

type PropsWithOptionalParams<C extends NavigationStackComponent> = ComponentPropsOf<C> extends { params?: unknown }
	? undefined extends ComponentPropsOf<C>['params']
		? Exclude<ComponentPropsOf<C>['params'], undefined>
		: never
	: never

export type NavigationParamsRequired<C extends NavigationStackComponent> = PropsWithRequiredParams<C>

export type NavigationParamsOptional<C extends NavigationStackComponent> = PropsWithOptionalParams<C>
