import { useContext } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

import type { ImageList, Variant } from '~/domain/images'
import { NavigationStackContext } from '~/navigation/Provider'

import * as styles from './ImageCard.css'
import { ImageDetailPage } from './ImageDetail.page'

interface ImageCardProps {
	image: ImageList
	variant: Variant

	class: string
	style?: JSX.CSSProperties

	onToggleFavorite?: () => void
	onScoreUp?: () => void
	onScoreDown?: () => void
}

export function ImageCard(props: ImageCardProps) {
	const { push } = useContext(NavigationStackContext)

	return (
		<div
			class={`${styles.card} ${props.class}`}
			style={props.style}
			onClick={function() {
				push(ImageDetailPage, props.image)
			}}
		>
			<img
				alt={props.image.id.toString()}
				class={styles.image}
				loading='lazy'
				src={props.variant.src}
			/>
		</div>
	)
}
