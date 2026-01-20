import type { Accessor, Component, ComponentProps, JSX } from 'solid-js'

import type { ImageEntry, IngestId } from '~/domain'
import type { IngestIdListParams } from '~/hooks/types'

import type { LayoutChildAccessors, LayoutProps, LayoutPropsBase } from './shared/types'

export interface ImageLayoutControllerProps<Layout extends Component<LayoutProps<IngestId>>> {
	readonly children: (
		accessors: LayoutChildAccessors,
		getImage: Accessor<ImageEntry>,
	) => JSX.Element
	readonly header?: JSX.Element | string
	readonly layout: Layout
	readonly layoutProps?: Omit<ComponentProps<Layout>, keyof LayoutPropsBase<IngestId>>
	readonly requestParams: IngestIdListParams
	readonly useMoreButton?: boolean
}
