import { createComponent, createRoot, useContext } from 'solid-js'

import { NavigationStackContext, NavigationStackProvider } from './Provider'
import type { NavigationStackComponent, NavigationStackContextValue, NavigationStackProviderProps } from './types'

interface SetupResult {
	readonly context: NavigationStackContextValue
	readonly dispose: () => void
}

function setupProvider(initialRoute?: NavigationStackComponent): SetupResult {
	let context: NavigationStackContextValue | undefined
	let dispose: () => void = () => {}

	createRoot(function(disposeFn) {
		dispose = disposeFn

		function Capture() {
			context = useContext(NavigationStackContext)
			return null
		}

		const providerProps: NavigationStackProviderProps = {
			get children() {
				return createComponent(Capture, {})
			},
		}
		if (initialRoute !== undefined) {
			providerProps.initialRoute = initialRoute
		}

		createComponent(NavigationStackProvider, providerProps)
	})

	if (!context) {
		throw new Error('NavigationStackContext was not captured')
	}

	return { context, dispose } as const
}

describe('NavigationStackProvider', () => {
	it('pushes the initial route on mount', async () => {
		const Initial = (() => null) as NavigationStackComponent
		const { context, dispose } = setupProvider(Initial)

		await Promise.resolve()

		const stack = context.getStack()
		expect(stack).toHaveLength(1)
		expect(stack[0].component).toBe(Initial)

		dispose()
	})

	it('reports canPop as false on an empty stack', () => {
		const { context, dispose } = setupProvider()

		expect(context.getStack()).toHaveLength(0)
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

		const { context, dispose } = setupProvider()

		const params = { id: 123 }
		context.push(Detail, params)

		const stack = context.getStack()
		expect(stack).toHaveLength(1)
		expect(stack[0].component).toBe(Detail)
		expect(stack[0].params).toEqual(params)
		expect(stack[0].overlay).toBe(true)

		dispose()
	})

	it('replaces the top item while keeping the rest', () => {
		const First = (() => null) as NavigationStackComponent
		const Second = (() => null) as NavigationStackComponent
		const Replacement = (() => null) as NavigationStackComponent

		const { context, dispose } = setupProvider()

		context.push(First)
		context.push(Second)
		context.replace(Replacement)

		const stack = context.getStack()
		expect(stack).toHaveLength(2)
		expect(stack[0].component).toBe(First)
		expect(stack[1].component).toBe(Replacement)

		dispose()
	})

	it('pops items and updates canPop', () => {
		const First = (() => null) as NavigationStackComponent
		const Second = (() => null) as NavigationStackComponent

		const { context, dispose } = setupProvider()

		context.push(First)
		expect(context.canPop()).toBe(false)

		context.push(Second)
		expect(context.canPop()).toBe(true)

		context.pop()
		expect(context.getStack()).toHaveLength(1)
		expect(context.canPop()).toBe(false)

		dispose()
	})
})
