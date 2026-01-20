import { createRenderEffect, onCleanup, type Accessor } from 'solid-js'

const DATA_SURFACE_KEY = 'surface' as const

type SurfaceType = 'primary' | 'secondary'

export function useSurfaceScope(
	getSurface: Accessor<SurfaceType>,
	element: HTMLElement = document.documentElement,
): void {
	const previousSurface = element.dataset[DATA_SURFACE_KEY]

	createRenderEffect(function() {
		const value = getSurface()
		if (element.dataset[DATA_SURFACE_KEY] !== value) {
			element.dataset[DATA_SURFACE_KEY] = value
		}
	})

	onCleanup(function() {
		if (previousSurface === undefined) {
			delete element.dataset[DATA_SURFACE_KEY]
		} else {
			element.dataset[DATA_SURFACE_KEY] = previousSurface
		}
	})
}
