import { createEffect, createMemo, Show, useContext } from 'solid-js'

import { disableBodyScroll, enableBodyScroll } from '~/utils/scrollLock'

import { NavigationStackContext } from './Provider'
import type { NavigationEntry } from './types'

export function NavigationStackRender() {
	const context = useContext(NavigationStackContext)
	if (context === undefined) {
		throw new Error('NavigationStackContext must be used within a <NavigationStackProvider>.')
	}

	const getTop = createMemo(function() {
		const items = context.getEntries()
		return items.at(-1)
	})

	const getOverlay = createMemo(function() {
		const top = getTop()
		return top?.overlay ? top : undefined
	})

	const getContent = createMemo(function() {
		const items = context.getEntries()
		if (items.length === 0) {
			return undefined
		}
		if (items.length === 1) {
			return items[0]
		}

		const top = items[items.length - 1]
		return top.overlay ? items[items.length - 2] : top
	})

	createEffect(function() {
		if (getOverlay()?.overlay) {
			disableBodyScroll()
		} else {
			enableBodyScroll()
		}
	})

	function NavigationItemRender(props: { item: Omit<NavigationEntry, 'key'> }) {
		// eslint-disable-next-line solid/reactivity
		const Comp = props.item.component
		return <Comp params={props.item.params} />
	}

	return (
		<>
			<Show keyed when={getContent()}>
				{function(back) {
					return (
						<div
							class='NavigationStack__content'
							style={getOverlay() ? { 'pointer-events': 'none' } : undefined}
						>
							<NavigationItemRender item={back} />
						</div>
					)
				}}
			</Show>

			<Show keyed when={getOverlay()}>
				{function(overlay) {
					return (
						<div class='NavigationStack__overlay' style={{ position: 'fixed', inset: 0 }}>
							<NavigationItemRender item={overlay} />
						</div>
					)
				}}
			</Show>
		</>
	)
}
