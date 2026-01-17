import type { NavigationLocation } from '../types'

import type { NavigationDriver } from './types'

export const historyDriver: NavigationDriver = {
	get location(): NavigationLocation {
		return window.location
	},
	get state(): unknown {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return window.history.state
	},

	push(snapshot, url) {
		window.history.pushState(snapshot, '', url)
	},
	replace(snapshot, url) {
		window.history.replaceState(snapshot, '', url)
	},
	pop() {
		window.history.back()
	},
	canPop() {
		return window.history.length > 1
	},
	onPop(handler) {
		function handlePop(event: PopStateEvent): void {
			handler(event.state)
		}

		window.addEventListener('popstate', handlePop)
		return function() {
			window.removeEventListener('popstate', handlePop)
		}
	},
}
