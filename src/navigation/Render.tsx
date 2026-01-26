import { Show } from 'solid-js'

import { useNavigation } from './useNavigation'

export function NavigationStackRender() {
	const { getEntry } = useNavigation()
	return (
		<Show keyed when={getEntry()}>
			{function(item) {
				const Comp = item.component
				return <Comp params={item.params} />
			}}
		</Show>
	)
}
