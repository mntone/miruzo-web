import { untrack, type Accessor, type Component, type ComponentProps } from 'solid-js'

import type { ImageEntry } from '~/domain'

import type { LayoutItemsProps, LayoutComponent, LayoutItemProps } from './shared/types'
import type { LayoutMetrics } from './types'

type ImageLayoutComponentBase = LayoutComponent<ImageEntry>

interface ImageLayoutHostProps<Layout extends ImageLayoutComponentBase> {
	readonly getMetrics: Accessor<LayoutMetrics>

	readonly itemComponent: Component<LayoutItemProps<ImageEntry>>
	/** Render order is preserved; no sorting/filtering is applied. */
	readonly items: readonly ImageEntry[]
	/** Read once on mount; changes after mount are ignored. */
	readonly layout: Layout
	/** Forwarded to the layout component and updated reactively. */
	readonly layoutProps?: Omit<ComponentProps<Layout>, keyof LayoutItemsProps<ImageEntry>>
}

export function ImageLayoutHost<Layout extends ImageLayoutComponentBase>(props: ImageLayoutHostProps<Layout>) {
	const Layout = untrack(function() {
		return props.layout
	})
	return (
		<Layout
			getItems={function() {
				return props.items
			}}
			getMetrics={props.getMetrics}
			itemComponent={props.itemComponent}
			{...props.layoutProps}
		/>
	)
}
