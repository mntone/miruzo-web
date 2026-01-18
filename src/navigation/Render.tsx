import { Show, useContext } from 'solid-js'

import { NavigationStackContext } from './Provider'

export function NavigationStackRender() {
	const context = useContext(NavigationStackContext)
	if (context === undefined) {
		throw Error('NavigationStackContext must be used within a <NavigationStackProvider>.')
	}

	return (
		<Show keyed when={context.getEntry()}>
			{function(item) {
				const Comp = item.component
				return <Comp params={item.params} />
			}}
		</Show>
	)
}
