import { createMemo, useContext, type Accessor } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

import type { ImageEntry } from '~/domain'
import { NavigationStackContext } from '~/navigation/Provider'
import { DetailPage } from '~/pages/detail'

import { getPreferredVariant } from './ImageLayout/utils'
import * as styles from './ListCard.css'

interface ListCardProps {
	getImage: Accessor<ImageEntry>
	getLayoutStyle: (itemHeight: number) => JSX.CSSProperties
	getCardWidth: Accessor<number>
	getNativeCardWidth: Accessor<number>
}

export function ListCard(props: ListCardProps) {
	const { push } = useContext(NavigationStackContext)

	const getVariant = createMemo(function() {
		return getPreferredVariant(
			props.getImage().variants,
			props.getNativeCardWidth(),
		)
	})

	const getStyle = createMemo(function() {
		const variant = getVariant()
		const cardWidth = props.getCardWidth()
		const scaledHeight = variant.height * (cardWidth / variant.width)
		const layoutStyle = props.getLayoutStyle(scaledHeight)
		return layoutStyle
	})

	return (
		<div
			class={styles.card}
			style={getStyle()}
			onClick={function() {
				push(DetailPage, props.getImage().id)
			}}
		>
			<img
				alt={props.getImage().id.toString()}
				class={styles.image}
				decoding='async'
				loading='lazy'
				src={getVariant().src}
			/>
		</div>
	)
}
