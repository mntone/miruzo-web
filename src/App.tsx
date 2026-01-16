import { NavigationStackProvider } from '~/navigation/Provider'
import { NavigationStackRender } from '~/navigation/Render'

import { initialRouteId, navigationRoutes } from './pages/routes'

export function App() {
	return (
		<NavigationStackProvider
			initialRouteId={initialRouteId}
			routes={navigationRoutes}
		>
			<NavigationStackRender />
		</NavigationStackProvider>
	)
}
