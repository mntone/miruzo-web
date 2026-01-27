import { createMemo, For, type Accessor, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import * as styleUtils from '../../shared/style'
import type { LayoutMetrics } from '../types'

import { computeMasonryExtraLayoutMetrics, type MasonryExtraLayoutMetrics } from './extraLayoutMetrics'
import type { MasonryLayoutProps } from './types'

function getChildrenStyleBase(
	getMetrics: Accessor<LayoutMetrics>,
	extraMetrics: MasonryExtraLayoutMetrics,
	scaledHeight: number,
) {
	const roundedScaledHeight = 0.0001 * Math.round(10000 * scaledHeight)
	const gridHeight = Math.round(extraMetrics.rowSize * (scaledHeight + getMetrics().verticalSpacing))
	const style: JSX.CSSProperties = {
		'grid-row-end': `span ${gridHeight}`,
		'height': `${roundedScaledHeight}px`,
	}
	return style
}

export function MasonryLayout<Item>(props: MasonryLayoutProps<Item>) {
	const extraMetrics = computeMasonryExtraLayoutMetrics()
	const getLayoutStyle = createMemo(function() {
		const metrics = props.getMetrics()
		const style: JSX.CSSProperties = {
			'display': 'grid',
			'gap': `0 ${metrics.horizontalSpacing}px`,
			'grid-auto-rows': `${extraMetrics.rowUnit}px`,
			'grid-template-columns': `repeat(${metrics.cols}, ${metrics.itemWidth}px)`,
			'padding': styleUtils.zeroVerticalHorizontalPxNonZero(props.getMetrics().outerPadding),
		}
		return style
	})

	return (
		<Dynamic
			class={/* @once */ styleUtils.classOptional('layout-root', props.class)}
			classList={props.classList}
			component={/* @once */ props.as || 'div'}
			style={{
				...props.style,
				'width': styleUtils.px(props.getMetrics().containerWidth),
				'--layout-padding': styleUtils.pxNonZero(props.getMetrics().outerPadding),
			}}
			onAnimationEnd={/* @once */ props.onAnimationEnd}
		>
			{/* @once */ props.header}

			<div style={getLayoutStyle()}>
				<For each={/* @once */ props.getItems()}>
					{function(item, getIndex) {
						// eslint-disable-next-line solid/reactivity
						return props.children(
							item,
							getIndex,
							getChildrenStyleBase.bind(null, props.getMetrics, extraMetrics),
						)
					}}
				</For>
			</div>

			{/* @once */ props.footer}
		</Dynamic>
	)
}
