import { Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { useNavigation } from './useNavigation'

export function NavigationStackRender() {
	const { getEntry } = useNavigation()
	return (
		<Show keyed when={getEntry()}>
			{function(item) {
				if (import.meta.env.DEV) {
					return <Dynamic component={item.component} params={item.params} />
				} else {
					return <item.component params={item.params} />
				}
			}}
		</Show>
	)
}
