import { createMemo, createSignal, For, type Accessor, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { useParentContentSize } from '~/hooks'

import { normalizeIntervals } from '../shared/layoutMetrics'

import { defaultIntervals } from './config'
import * as styles from './Layout.css'
import { computeMasonryMetrics } from './layoutMetrics'
import type { MasonryImageLayoutProps, MasonryLayoutMetrics } from './types'

function getChildrenStyleBase(
	getMetrics: Accessor<MasonryLayoutMetrics>,
	scaledHeight: number,
) {
	const metrics = getMetrics()
	const roundedScaledHeight = 0.0001 * Math.round(10000 * scaledHeight)
	const gridHeight = Math.round(metrics.rowSize * (scaledHeight + metrics.verticalSpacing))
	const style: JSX.CSSProperties = {
		'grid-row-end': 'span ' + gridHeight,
		'height': roundedScaledHeight + 'px',
	}
	return style
}

export function MasonryImageLayout<Item>(props: MasonryImageLayoutProps<Item>) {
	const [getEl, setEl] = createSignal<HTMLElement | undefined>(undefined)
	const getLayoutSize = useParentContentSize(getEl)

	const getMetrics = createMemo(function() {
		const width = getLayoutSize()[0]
		const intervals = normalizeIntervals(props.intervals || defaultIntervals)
		return computeMasonryMetrics(width, intervals)
	})

	const getContainerStyle = createMemo(function() {
		const metrics = getMetrics()
		const style: JSX.CSSProperties = {
			'padding': '0 ' + metrics.outerPadding + 'px',
			'--m-columns': metrics.cols,
			'--g-spacing-x': metrics.horizontalSpacing + 'px',
			'--g-spacing-y': metrics.verticalSpacing + 'px',
			'--m-item-width': metrics.itemWidthMode == 'fixed'
				? metrics.itemWidth + 'px'
				: '1fr',
			'--m-row-unit': metrics.rowUnit + 'px',
		}
		if (metrics.containerWidth !== undefined) {
			style.width = metrics.containerWidth + 'px'
		}
		return style
	})

	const getChildWidth = createMemo(function() {
		const metrics = getMetrics()
		return metrics.itemWidth
	})

	const getNativeChildWidth = createMemo(function() {
		const metrics = getMetrics()
		return metrics.nativeItemWidth
	})

	return (
		<Dynamic
			ref={setEl}
			class={styles.container}
			component={props.as}
			style={getContainerStyle()}
		>
			{props.header}

			<div class={styles.layout}>
				<For each={props.getItems()}>
					{props.children.bind(
						null,
						{
							getChildStyle: getChildrenStyleBase.bind(null, getMetrics),
							getChildWidth,
							getNativeChildWidth,
						},
					)}
				</For>
			</div>

			{props.footer}
		</Dynamic>
	)
}
