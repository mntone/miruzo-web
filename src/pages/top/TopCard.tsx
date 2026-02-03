import { createMemo } from 'solid-js'

import type { RovingItemProps } from '~/components/ImageLayout/shared/useRovingTabIndex'
import { getPreferredVariant } from '~/components/ImageLayout/utils'
import type { ImageEntry } from '~/domain'
import { useNavigation } from '~/navigation'

import { DetailPage } from '../detail'

import * as styles from './TopCard.css'

interface TopCardProps extends RovingItemProps {
	readonly item: ImageEntry
	readonly nativeItemWidth: number
}

export function TopCard(props: TopCardProps) {
	const { push } = useNavigation()

	const getVariant = createMemo(function() {
		return getPreferredVariant(
			props.item.variants,
			props.nativeItemWidth,
		)
	})

	return (
		<button
			ref={/* @once */ props.ref}
			class={/* @once */ 'card ' + styles.card}
			role='gridcell'
			tabindex={props.tabIndex}
			type='button'
			onClick={function() {
				push(DetailPage, props.item.id)
			}}
			// eslint-disable-next-line solid/reactivity -- fixed at setup
			onFocus={props.onFocus}
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
		</button>
	)
}
