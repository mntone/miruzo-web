import { NavigationStackProvider } from '~/navigation/Provider'
import { NavigationStackRender } from '~/navigation/Render'

import { TopPage } from './pages/TopPage'

export function App() {
	return (
		<NavigationStackProvider initialRoute={TopPage}>
			<NavigationStackRender />
		</NavigationStackProvider>
	)
}
