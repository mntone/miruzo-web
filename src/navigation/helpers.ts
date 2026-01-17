import type { Component } from 'solid-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NavigationStackComponent<P extends Record<string, unknown> = any> = Component<P>

type IsAny<T> = 0 extends (1 & T) ? true : false
type ComponentPropsOf<C> = C extends (...args: infer Args) => unknown
	? Args[0]
	: never
type SafeProps<T> = IsAny<T> extends true ? never : T

type ParamsOf<C extends NavigationStackComponent>
	= 'params' extends keyof ComponentPropsOf<C>
		? SafeProps<ComponentPropsOf<C>>['params']
		: never

export type NavigationParamsRequired<C extends NavigationStackComponent>
	= ComponentPropsOf<C> extends { params: infer P }
		? undefined extends ParamsOf<C>
			? never
			: P
		: never

export type NavigationParamsOptional<C extends NavigationStackComponent>
	= ComponentPropsOf<C> extends { params?: unknown }
		? undefined extends ParamsOf<C>
			? Exclude<ParamsOf<C>, undefined>
			: never
		: never
