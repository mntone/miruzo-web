import { createMemo } from 'solid-js'

import type { NavigationStackComponent } from './helpers'
import { useNavigation } from './useNavigation'

interface LinkProps {
	readonly alternateLabel?: string
	readonly class?: string
	readonly children: string
	readonly component: NavigationStackComponent
	readonly params?: unknown
}

export function Link(props: LinkProps) {
	const { getRouteByComponent, push } = useNavigation()

	const getUrl = createMemo(function() {
		const route = getRouteByComponent(props.component)
		return route.toPath(props.params)
	})

	function handleClick(e: MouseEvent) {
		e.preventDefault()
		push(props.component, props.params)
	}

	return (
		<>
			<button
				class={props.class}
				type='button'
				onClick={handleClick}
			>
				{props.children}
			</button>

			<a
				class='screen-reader-only'
				href={getUrl()}
				tabindex='-1'
				onClick={function(e) {
					if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
						return
					}

					handleClick(e)
				}}
			>
				{props.alternateLabel || props.children}
			</a>
		</>
	)
}
