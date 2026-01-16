import { createMemo, Show, useContext } from 'solid-js'

import { NavigationStackContext } from './Provider'
import type { NavigationEntry } from './types'

export function NavigationStackRender() {
	const context = useContext(NavigationStackContext)
	if (context === undefined) {
		throw new Error('NavigationStackContext must be used within a <NavigationStackProvider>.')
	}

	const getContent = createMemo(function() {
		const items = context.getEntries()
		if (items.length === 0) {
			return undefined
		}
		if (items.length === 1) {
			return items[0]
		}

		const top = items[items.length - 1]
		return top
	})

	function NavigationItemRender(props: { item: NavigationEntry }) {
		// eslint-disable-next-line solid/reactivity
		const Comp = props.item.component
		return <Comp params={props.item.params} />
	}

	return (
		<Show keyed when={getContent()}>
			{function(item) {
				return <NavigationItemRender item={item} />
			}}
		</Show>
	)
}
