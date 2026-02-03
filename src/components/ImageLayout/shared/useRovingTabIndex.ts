import { createEffect, createSignal, onCleanup, type JSX } from 'solid-js'

export interface RovingOptions {
	readonly initialIndex?: number | undefined

	getItemCount(this: void): number
	// return undefined when key should not be consumed
	resolveNextIndex(this: void, event: KeyboardEvent, index: number): number | undefined
}

export interface RovingContainerProps {
	ref(this: void, element: HTMLElement | undefined): void
	readonly onFocusIn: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> | undefined
	readonly onFocusOut: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> | undefined
	readonly onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> | undefined
}

export interface RovingItemProps {
	ref(this: void, element: HTMLElement | undefined): void
	readonly tabIndex: '0' | '-1'
	readonly onFocus: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent>
}

export function useRovingTabIndex(options: RovingOptions): readonly [
	RovingContainerProps,
	(index: number) => RovingItemProps,
] {
	const {
		initialIndex = 0,
		getItemCount,
	} = options

	const [getFocusIndex, setFocusIndex] = createSignal(initialIndex)
	createEffect(function() {
		const lastIndex = Math.max(0, getItemCount() - 1)
		if (getFocusIndex() > lastIndex) {
			setFocusIndex(lastIndex)
		}
	})

	let container: HTMLElement | undefined
	const [getContainerHadFocus, setContainerHadFocus] = createSignal(false)
	const containerProps: RovingContainerProps = {
		ref(element: HTMLElement | undefined) {
			container = element
			onCleanup(function() {
				container = undefined
			})
		},
		onFocusIn(event) {
			if (container?.contains(event.target as Node)) {
				setContainerHadFocus(true)
			}
		},
		onFocusOut(event) {
			if (!container?.contains(event.relatedTarget as Node)) {
				setContainerHadFocus(false)
			}
		},
		onKeyDown(event) {
			const nextIndex = options.resolveNextIndex(event, getFocusIndex())
			if (nextIndex !== undefined) {
				event.preventDefault()
				setFocusIndex(nextIndex)
			}
		},
	}

	createEffect(function() {
		if (getContainerHadFocus()) {
			elements.get(getFocusIndex())?.focus()
		}
	})

	const elements = new Map<number, HTMLElement>()
	function getItemProps(index: number): RovingItemProps {
		return {
			ref(element: HTMLElement | undefined) {
				if (element !== undefined) {
					elements.set(index, element)
					onCleanup(elements.delete.bind(elements, index))

					if (getContainerHadFocus() && index === getFocusIndex()) {
						queueMicrotask(element.focus.bind(element))
					}
				}
			},
			tabIndex: index === getFocusIndex() ? '0' : '-1',
			onFocus() {
				if (getFocusIndex() !== index) {
					setFocusIndex(index)
				}
			},
		}
	}

	return [containerProps, getItemProps]
}
