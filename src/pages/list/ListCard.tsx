import { createMemo, useContext } from 'solid-js'

import type { LayoutItemProps } from '~/components/ImageLayout/shared/types'
import { getPreferredVariant } from '~/components/ImageLayout/utils'
import type { ImageEntry } from '~/domain'
import { NavigationStackContext } from '~/navigation/Provider'

import { DetailPage } from '../detail'

import * as styles from './ListCard.css'

type ListCardProps = LayoutItemProps<ImageEntry>

export function ListCard(props: ListCardProps) {
	const { push } = useContext(NavigationStackContext)

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
		const layoutStyle = props.getItemStyle!(scaledHeight)
		return layoutStyle
	})

	return (
		<div
			class={styles.card}
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
