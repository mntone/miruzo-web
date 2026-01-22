import { createMemo, For, type Accessor, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import * as styleUtils from '../../shared/style'
import type { LayoutMetrics } from '../types'

import { computeMasonryExtraLayoutMetrics, type MasonryExtraLayoutMetrics } from './extraLayoutMetrics'
import * as styles from './MasonryLayout.css'
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
			'--m-columns': metrics.cols,
			'--g-spacing-x': `${metrics.horizontalSpacing}px`,
			'--g-spacing-y': `${metrics.verticalSpacing}px`,
			'--m-item-width': `${metrics.itemWidth}px`,
			'--m-row-unit': `${extraMetrics.rowUnit}px`,
		}
		return style
	})

	return (
		<Dynamic
			class={styleUtils.classOptional('layout-root', props.class)}
			component={props.as || 'div'}
			style={{
				...props.style,
				padding: styleUtils.zeroVerticalHorizontalPxNonZero(props.getMetrics().outerPadding),
				width: styleUtils.px(props.getMetrics().containerWidth),
			}}
		>
			{props.header}

			<div class={styles.layout} style={getLayoutStyle()}>
				<For each={props.getItems()}>
					{function(item) {
						const Component = props.itemComponent
						return (
							<Component
								getItemStyle={getChildrenStyleBase.bind(null, props.getMetrics, extraMetrics)}
								item={item}
								itemWidth={props.getMetrics().itemWidth}
								nativeItemWidth={props.getMetrics().nativeItemWidth}
							/>
						)
					}}
				</For>
			</div>

			{props.footer}
		</Dynamic>
	)
}
