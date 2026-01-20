import { createSignal, onCleanup, type Accessor } from 'solid-js'

import type { Size } from './types'

function equalsSize(val1: Size, val2: Size): boolean {
	return val1[0] === val2[0] && val1[1] === val2[1]
}

export function useContentSize(getElement: Accessor<HTMLElement | undefined>): Accessor<Size> {
	const [getSize, setSize] = createSignal<Size>([0, 0])

	if (typeof ResizeObserver === 'undefined') {
		console.warn('ResizeObserver is not supported')
		return getSize
	}

	const observer = new ResizeObserver(function(entries) {
		const nextSize = entries[0].contentRect
		const next: Size = [nextSize.width, nextSize.height]
		if (!equalsSize(next, getSize())) {
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
