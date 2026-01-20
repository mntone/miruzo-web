import { createMemo, useContext, type Accessor } from 'solid-js'

import { getPreferredVariant } from '~/components/ImageLayout/utils'
import type { ImageEntry } from '~/domain'
import { NavigationStackContext } from '~/navigation/Provider'

import { DetailPage } from '../detail'

import * as styles from './TopCard.css'

interface TopCardProps {
	getImage: Accessor<ImageEntry>
	getNativeCardWidth: Accessor<number>
}

export function TopCard(props: TopCardProps) {
	const { push } = useContext(NavigationStackContext)

	const getVariant = createMemo(function() {
		return getPreferredVariant(
			props.getImage().variants,
			props.getNativeCardWidth(),
		)
	})

	return (
		<div
			class={styles.card}
			onClick={function() {
				push(DetailPage, props.getImage().id)
			}}
		>
			<div
				class={styles.backgroundImage}
				style={{
					'background-image': `url(${getVariant().src})`,
				}}
			/>
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
