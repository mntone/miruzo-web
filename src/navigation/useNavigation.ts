import { useContext } from 'solid-js'

import { NavigationStackContext } from './Provider'

export function useNavigation() {
	const context = useContext(NavigationStackContext)
	if (context === undefined) {
		throw Error('useNavigation must be used inside <NavigationStackProvider>.')
	}
	return context
}
