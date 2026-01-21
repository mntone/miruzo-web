import { untrack, type Component, type ComponentProps, type JSX } from 'solid-js'

import type { ImageEntry } from '~/domain'

import type { LayoutComponent, LayoutItemPropsBase, LayoutPropsBase } from './shared/types'

type ImageLayoutComponentBase = LayoutComponent<ImageEntry>

interface ImageLayoutHostProps<Layout extends ImageLayoutComponentBase> {
	readonly itemComponent: Component<LayoutItemPropsBase<ImageEntry>>
	/** Render order is preserved; no sorting/filtering is applied. */
	readonly items: readonly ImageEntry[]
	/** Read once on mount; changes after mount are ignored. */
	readonly layout: Layout
	/** Forwarded to the layout component and updated reactively. */
	readonly layoutProps?: Omit<ComponentProps<Layout>, keyof LayoutPropsBase<ImageEntry>>

	readonly header?: JSX.Element
	readonly footer?: JSX.Element
}

export function ImageLayoutHost<Layout extends ImageLayoutComponentBase>(props: ImageLayoutHostProps<Layout>) {
	const Layout = untrack(function() {
		return props.layout
	})
	return (
		<Layout
			footer={props.footer}
			getItems={function() {
				return props.items
			}}
			header={props.header}
			itemComponent={props.itemComponent}
			{...props.layoutProps}
		/>
	)
}
