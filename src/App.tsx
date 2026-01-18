import { NavigationStackProvider } from '~/navigation/Provider'
import { NavigationStackRender } from '~/navigation/Render'

import { historyDriver } from './navigation/drivers/history'
import { initialRouteId, navigationRoutes } from './pages/route'

export function App() {
	return (
		<NavigationStackProvider
			driver={historyDriver}
			initialRouteId={initialRouteId}
			routes={navigationRoutes}
		>
			<NavigationStackRender />
		</NavigationStackProvider>
	)
}
