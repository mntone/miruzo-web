import type { Accessor, JSX, JSXElement } from 'solid-js'

import type { IngestId } from '~/domain'

export interface ImageLayoutProps {
	readonly as?: keyof HTMLElementTagNameMap
	readonly header: JSX.Element
	readonly footer: JSX.Element

	readonly getImageIds: Accessor<readonly IngestId[]>
}

export interface ImageLayoutControllerProps {
	readonly layout: (props: ImageLayoutProps) => JSXElement
}
