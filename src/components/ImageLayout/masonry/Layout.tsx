import { createMemo, createSignal, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { ImageCard } from '~/components/ImageCard'
import type { IngestId, VariantEntry } from '~/domain'
import { useContentSize } from '~/hooks/useContentSize'
import { imageStore } from '~/stores/images'

import { getPreferredVariant } from '../utils'

import { defaultIntervals, getFixedItemWidth } from './config'
import * as styles from './Layout.css'
import { computeMasonryMetrics } from './layoutMetrics'
import type { MasonryImageLayoutProps, MasonryLayoutMetrics } from './types'

function createItemStyle(
	variant: VariantEntry,
	metrics: MasonryLayoutMetrics,
	rowUnit: number,
) {
	const scaledHeight = variant.height * (metrics.finalWidth / variant.width)
	const roundedScaledHeight = 0.0001 * Math.round(10000 * scaledHeight)
	const gridHeight = Math.floor((scaledHeight + metrics.gap) / rowUnit)
	return {
		'--m-item-height': roundedScaledHeight + 'px',
		'--m-span': gridHeight,
	}
}

export function MasonryImageLayout(props: MasonryImageLayoutProps) {
	const [getEl, setEl] = createSignal<HTMLElement | undefined>(undefined)
	const getLayoutSize = useContentSize(getEl)

	const getMetrics = createMemo(function() {
		const width = getLayoutSize()[0]
		const intervals = props.intervals || defaultIntervals
		const getItemWidth = props.getFixedItemWidth || getFixedItemWidth
		return computeMasonryMetrics(width, intervals, getItemWidth)
	})

	const getStyle = createMemo(function() {
		const metrics = getMetrics()
		const style = {
			'--m-columns': metrics.cols,
			'--m-gap': metrics.gap + 'px',
			'--m-item-width': metrics.fixedWidth !== undefined
				? metrics.fixedWidth + 'px'
				: '1fr',
			'--m-width': metrics.layoutWidth !== undefined
				? metrics.layoutWidth + 'px'
				: '100%',
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
				<For each={props.getImageIds()}>
					{function(imageId: IngestId) {
						const image = imageStore.imagesById[imageId]
						if (!image) {
							return null
						}

						const variant = getPreferredVariant(image.variants, getMetrics().effectiveFinalWidth)
						const getItemStyle = createMemo(function() {
							return createItemStyle(
								variant,
								getMetrics(),
								1,
							)
						})
						return (
							<ImageCard
								class={styles.card}
								image={image}
								style={getItemStyle()}
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
