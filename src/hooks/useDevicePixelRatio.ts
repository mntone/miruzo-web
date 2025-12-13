import { createSignal, onCleanup } from 'solid-js'

export function useDevicePixelRatio() {
	const [getDevicePixelRatio, setDevicePixelRatio] = createSignal(window.devicePixelRatio)

	if (typeof ResizeObserver === 'undefined') {
		console.warn('ResizeObserver is not supported')
		return getDevicePixelRatio
	}

	const observer = new ResizeObserver(function() {
		const next = window.devicePixelRatio
		if (next !== getDevicePixelRatio()) {
			setDevicePixelRatio(next)
		}
	})
	onCleanup(observer.disconnect.bind(observer))

	observer.observe(document.body)
	return getDevicePixelRatio
}
