import { createMemo, type JSX } from 'solid-js'

import { getPreferredVariant } from '~/components/ImageLayout/utils'
import type { ImageEntry } from '~/domain'
import { useNavigation } from '~/navigation'

import { DetailPage } from '../detail'

import * as styles from './ListCard.css'

interface ListCardProps {
	readonly item: ImageEntry
	readonly itemWidth: number
	readonly nativeItemWidth: number
	readonly getItemStyle: (itemHeight: number) => JSX.CSSProperties
}

export function ListCard(props: ListCardProps) {
	const { push } = useNavigation()

	const getVariant = createMemo(function() {
		return getPreferredVariant(
			props.item.variants,
			props.nativeItemWidth,
		)
	})

	const getStyle = createMemo(function() {
		const variant = getVariant()
		const cardWidth = props.itemWidth
		const scaledHeight = variant.height * (cardWidth / variant.width)
		const layoutStyle = props.getItemStyle(scaledHeight)
		return layoutStyle
	})

	return (
		<div
			class={/* @once */ 'card ' + styles.card}
			style={getStyle()}
			onClick={function() {
				push(DetailPage, props.item.id)
			}}
		>
			<img
				alt={`${props.item.id}`}
				class={styles.image}
				decoding='async'
				loading='lazy'
				src={getVariant().src}
			/>
		</div>
	)
}
