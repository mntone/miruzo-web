import type { Component, ComponentProps, JSX } from 'solid-js'

import type { ImageEntry } from '~/domain'
import type { IngestIdListParams } from '~/hooks/types'

import type { LayoutItemPropsBase, LayoutProps, LayoutPropsBase } from './shared/types'

export type { LayoutItemPropsBase }

export interface ImageLayoutControllerProps<Layout extends Component<LayoutProps<ImageEntry>>> {
	readonly header?: JSX.Element | string
	readonly itemComponent: Component<LayoutItemPropsBase<ImageEntry>>
	readonly layout: Layout
	readonly layoutProps?: Omit<ComponentProps<Layout>, keyof LayoutPropsBase<ImageEntry>>
	readonly requestParams: IngestIdListParams
	readonly useMoreButton?: boolean
}
