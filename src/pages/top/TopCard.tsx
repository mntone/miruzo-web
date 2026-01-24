import { createMemo, useContext } from 'solid-js'

import { getPreferredVariant } from '~/components/ImageLayout/utils'
import type { ImageEntry } from '~/domain'
import { NavigationStackContext } from '~/navigation/Provider'

import { DetailPage } from '../detail'

import * as styles from './TopCard.css'

interface TopCardProps {
	readonly item: ImageEntry
	readonly nativeItemWidth: number
}

export function TopCard(props: TopCardProps) {
	const { push } = useContext(NavigationStackContext)

	const getVariant = createMemo(function() {
		return getPreferredVariant(
			props.item.variants,
			props.nativeItemWidth,
		)
	})

	return (
		<div
			class={/* @once */ 'card ' + styles.card}
			onClick={function() {
				push(DetailPage, props.item.id)
			}}
		>
			<div
				class={styles.backgroundImage}
				style={{
					'background-image': `url(${getVariant().src})`,
				}}
			/>
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
