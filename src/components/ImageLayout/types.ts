import type { Accessor, JSX, JSXElement } from 'solid-js'

import type { ImageListType } from '~/api/types'
import type { IngestId } from '~/domain'

export interface ImageLayoutProps {
	readonly as?: keyof HTMLElementTagNameMap
	readonly header: JSX.Element
	readonly footer: JSX.Element

	readonly getImageIds: Accessor<readonly IngestId[]>
}

export interface ImageLayoutControllerProps {
	readonly limit?: number
	readonly listType: ImageListType
	readonly layout: (props: ImageLayoutProps) => JSXElement
}
