import { createContext, createMemo, createSignal, onMount } from 'solid-js'

import type { NavigationStackContextValue, NavigationStackItem, NavigationStackProviderProps, NavigationStackComponent, NavigationParamsRequired, NavigationParamsOptional } from './types'

const emptyContext: NavigationStackContextValue = {
	canPop() {
		return false
	},
	getStack() {
		return []
	},

	push() {},
	replace() {},
	pop() {},
} as const

export const NavigationStackContext = createContext<NavigationStackContextValue>(emptyContext)

export function NavigationStackProvider(props: NavigationStackProviderProps) {
	const [getStack, setStack] = createSignal<NavigationStackItem[]>([])

	function createStackItem(component: NavigationStackComponent, params?: unknown): NavigationStackItem {
		return {
			key: Date.now().toString(),
			component,
			params,
			...component.options,
		}
	}

	function push<C extends NavigationStackComponent>(component: C, params: NavigationParamsRequired<C>): void
	function push<C extends NavigationStackComponent>(component: C, params?: NavigationParamsOptional<C>): void
	function push(component: NavigationStackComponent, params?: unknown): void {
		setStack(function(prevStack) {
			const newItem = createStackItem(component, params)
			const newStack = prevStack.concat(newItem)
			return newStack
		})
	}

	function replace<C extends NavigationStackComponent>(component: C, params: NavigationParamsRequired<C>): void
	function replace<C extends NavigationStackComponent>(component: C, params?: NavigationParamsOptional<C>): void
	function replace(component: NavigationStackComponent, params?: unknown): void {
		setStack(function(prevStack) {
			const newItem = createStackItem(component, params)
			const newStack = prevStack.slice(0, -1).concat(newItem)
			return newStack
		})
	}

	const canPop = createMemo(function() {
		return getStack().length > 1
	})

	function pop() {
		if (getStack().length <= 1) {
			if (import.meta.env.DEV) {
				throw Error('pop() requires at least 2 items')
			}
			return
		}

		setStack(function(prevStack) {
			const head = prevStack.slice(0, -1)
			return head
		})
	}

	const api: NavigationStackContextValue = {
		getStack,
		push,
		replace,
		canPop,
		pop,
	}

	onMount(function() {
		if (props.initialRoute) {
			push(props.initialRoute)
		}
	})

	return (
		<NavigationStackContext.Provider value={api}>
			{props.children}
		</NavigationStackContext.Provider>
	)
}
