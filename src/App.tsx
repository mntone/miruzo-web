import { NavigationStackProvider } from '~/navigation/Provider'
import { NavigationStackRender } from '~/navigation/Render'

import { HomePage } from './HomePage'

export function App() {
	return (
		<NavigationStackProvider initialRoute={HomePage}>
			<NavigationStackRender />
		</NavigationStackProvider>
	)
}
