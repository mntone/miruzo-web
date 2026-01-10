import { createMemo, useContext, type Accessor } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

import type { ImageEntry } from '~/domain'
import { NavigationStackContext } from '~/navigation/Provider'

import { ImageDetailPage } from './ImageDetail.page'
import { getPreferredVariant } from './ImageLayout/utils'
import * as styles from './TopCard.css'

interface TopCardProps {
	aspectRatio: string
	getImage: Accessor<ImageEntry>
	getLayoutStyle: (itemHeight: number) => JSX.CSSProperties
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
			style={{
				...props.getLayoutStyle(0),
				'aspect-ratio': props.aspectRatio,
			}}
			onClick={function() {
				push(ImageDetailPage, props.getImage().id)
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
				loading='lazy'
				src={getVariant().src}
			/>
		</div>
	)
}
