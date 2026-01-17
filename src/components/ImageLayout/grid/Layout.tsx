import { createMemo, createSignal, For } from 'solid-js'
import type { JSX } from 'solid-js/h/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import { useParentContentSize } from '~/hooks'

import { computeLayoutMetrics, normalizeIntervals } from '../shared/layoutMetrics'

import { defaultIntervals } from './config'
import * as styles from './Layout.css'
import type { GridImageLayoutProps } from './types'

export function GridImageLayout<Item>(props: GridImageLayoutProps<Item>) {
	const [getEl, setEl] = createSignal<HTMLElement | undefined>(undefined)
	const getLayoutSize = useParentContentSize(getEl)

	const getMetrics = createMemo(function() {
		const width = getLayoutSize()[0]
		const intervals = normalizeIntervals(props.intervals || defaultIntervals)
		return computeLayoutMetrics(width, intervals)
	})

	const getConstrainItems = createMemo(function() {
		const metrics = getMetrics()
		if (props.maxRows === undefined) {
			return props.getItems()
		}
		return props.getItems().slice(0, metrics.cols * props.maxRows)
	})

	const getContainerStyle = createMemo(function() {
		const metrics = getMetrics()
		const style: JSX.CSSProperties = {
			'padding-inline': `${metrics.outerPadding}px`,
			'--m-spacing-x': `${metrics.horizontalSpacing}px`,
			'--m-spacing-y': `${metrics.verticalSpacing}px`,
		}
		if (metrics.containerWidth !== undefined) {
			style.width = `${metrics.containerWidth}px`
		}
		return style
	})

	const getChildStyle = createMemo(function() {
		const metrics = getMetrics()
		const style: JSX.CSSProperties = {
			width: metrics.itemWidthMode == 'fixed'
				? `${metrics.itemWidth}px`
				: `calc((100% - ${metrics.totalHorizontalSpacing}px) / ${metrics.cols})`,
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
				<For each={getConstrainItems()}>
					{props.children.bind(null,
						{
							getChildStyle,
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
