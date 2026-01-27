import { type Accessor, type ComponentProps } from 'solid-js'

import type { ImageEntry } from '~/domain'

import type { DynamicLayoutRootProps, LayoutComponent, LayoutItemsProps } from './shared/types'
import type { LayoutMetrics } from './types'

type ImageLayoutComponentBase = LayoutComponent<ImageEntry>

interface ImageLayoutHostProps<Layout extends ImageLayoutComponentBase> extends DynamicLayoutRootProps {
	/** Read once on mount; changes after mount are ignored. */
	readonly children: LayoutItemsProps<ImageEntry>['children']

	readonly getMetrics: Accessor<LayoutMetrics>
	/** Render order is preserved; no sorting/filtering is applied. */
	readonly getImages: Accessor<readonly ImageEntry[]>
	/** Read once on mount; changes after mount are ignored. */
	readonly layout: Layout
	/** Forwarded to the layout component and updated reactively. */
	readonly layoutProps?: Omit<ComponentProps<Layout>, keyof (DynamicLayoutRootProps & LayoutItemsProps<ImageEntry>)>
}

export function ImageLayoutHost<Layout extends ImageLayoutComponentBase>(props: ImageLayoutHostProps<Layout>) {
	// eslint-disable-next-line solid/reactivity -- fixed at setup
	const Layout = props.layout
	return (
		<Layout
			{...props.layoutProps}
			classList={props.classList}
			getItems={/* @once */ props.getImages}
			getMetrics={/* @once */ props.getMetrics}
		>
			{/* @once */ props.children}
		</Layout>
	)
}
