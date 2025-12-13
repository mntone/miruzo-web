import type { Accessor, JSX, JSXElement } from 'solid-js'

import type { ImageList } from '~/domain/images'

export interface ImageLayoutProps {
	readonly as?: keyof HTMLElementTagNameMap
	readonly header: JSX.Element
	readonly footer: JSX.Element

	readonly getImages: Accessor<readonly ImageList[]>
}

export interface ImageLayoutControllerProps {
	readonly layout: (props: ImageLayoutProps) => JSXElement
}
