import { createEffect, createSignal, onCleanup, type Accessor } from 'solid-js'

export function useContentWidth(getElement: Accessor<HTMLElement | undefined>): Accessor<number> {
	const [getWidth, setWidth] = createSignal<number>(0)

	if (typeof ResizeObserver === 'undefined') {
		console.warn('ResizeObserver is not supported')
		return getWidth
	}

	const observer = new ResizeObserver(function(entries) {
		const next = entries[0].contentRect.width
		if (next !== getWidth()) {
			setWidth(next)
		}
	})
	onCleanup(observer.disconnect.bind(observer))

	let observedElement: HTMLElement | undefined
	createEffect(function() {
		const next = getElement()
		if (observedElement === next) {
			return
		}

		if (observedElement !== undefined) {
			observer.unobserve(observedElement)
		}
		if (next !== undefined) {
			observer.observe(next)
		}
		observedElement = next
	})

	return getWidth
}
