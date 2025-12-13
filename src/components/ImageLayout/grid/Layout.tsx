import { createMemo, createSignal, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { ImageCard } from '~/components/ImageCard'
import type { Variant } from '~/domain/images'
import { useContentSize } from '~/hooks/useContentSize'

import { getPreferredVariant } from '../utils'

import { defaultIntervals } from './config'
import * as styles from './Layout.css'
import { computeGridMetrics } from './layoutMetrics'

import type { GridImageLayoutProps } from '.'

function createItemStyle(variant: Variant) {
	if (!variant.width || !variant.height) {
		throw new Error('Image variant is missing intrinsic width or height')
	}

	return {
		'--g-aspect-ratio': variant.width / variant.height,
	}
}

export function GridImageLayout(props: GridImageLayoutProps) {
	const [getEl, setEl] = createSignal<HTMLElement | undefined>(undefined)
	const getLayoutSize = useContentSize(getEl)

	const getMetrics = createMemo(function() {
		const width = getLayoutSize()[0]
		const intervals = props.intervals || defaultIntervals
		return computeGridMetrics(width, intervals)
	})

	const getStyle = createMemo(function() {
		const metrics = getMetrics()
		const style = {
			'--g-columns': metrics.cols,
			'--g-gap': metrics.gap + 'px',
		}
		return style
	})

	return (
		<Dynamic
			ref={setEl}
			class={styles.container}
			component={props.as || 'div'}
			style={getStyle()}
		>
			{props.header}

			<div class={styles.layout}>
				<For each={props.getImages()}>
					{function(image) {
						const variant = getPreferredVariant(image.variants, window.devicePixelRatio * getMetrics().effectiveItemWidth)
						const style = createItemStyle(variant)
						return (
							<ImageCard
								class={styles.card}
								image={image}
								style={style}
								variant={variant}
							/>
						)
					}}
				</For>
			</div>

			{props.footer}
		</Dynamic>
	)
}
