import { createSignal, onCleanup, type Accessor } from 'solid-js'

export function useContentSize(getElement: Accessor<HTMLElement | undefined>) {
	const [getSize, setSize] = createSignal([0, 0])

	if (typeof ResizeObserver === 'undefined') {
		console.warn('ResizeObserver is not supported')
		return getSize
	}

	const observer = new ResizeObserver(function(entries) {
		const nextSize = entries[0].contentRect
		const next = [nextSize.width, nextSize.height]
		if (next !== getSize()) {
			setSize(next)
		}
	})
	onCleanup(observer.disconnect.bind(observer))

	queueMicrotask(function() {
		const el = getElement()
		if (el) {
			observer.observe(el)
		}
	})
	return getSize
}
