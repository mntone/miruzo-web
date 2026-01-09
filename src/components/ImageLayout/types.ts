import type { Accessor, Component, ComponentProps, JSX } from 'solid-js'

import type { ImageListType } from '~/api/types'
import type { ImageEntry, IngestId } from '~/domain'

import type { LayoutChildAccessors, LayoutProps, LayoutPropsBase } from './shared/types'

export interface ImageLayoutControllerProps<Layout extends Component<LayoutProps<IngestId>>> {
	readonly as?: keyof HTMLElementTagNameMap
	readonly children: (
		accessors: LayoutChildAccessors,
		getImage: Accessor<ImageEntry>,
	) => JSX.Element
	readonly header?: JSX.Element | string
	readonly limit?: number
	readonly listType: ImageListType
	readonly layout: Layout
	readonly layoutProps?: Omit<ComponentProps<Layout>, keyof LayoutPropsBase<IngestId>>
	readonly useMoreButton?: boolean
}
