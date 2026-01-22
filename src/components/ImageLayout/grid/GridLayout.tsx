import { createMemo, createSignal, For } from 'solid-js'
import type { JSX } from 'solid-js/h/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import { useParentContentSize } from '~/hooks'

import * as styleUtils from '../../shared/style'
import { computeLayoutMetrics, normalizeIntervals } from '../shared/layoutMetrics'

import { defaultIntervals } from './config'
import type { GridLayoutProps } from './types'

export function GridLayout<Item>(props: GridLayoutProps<Item>) {
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

	const getLayoutStyle = createMemo(function() {
		const metrics = getMetrics()
		const style: JSX.CSSProperties = {
			'gap': `${metrics.verticalSpacing}px ${metrics.horizontalSpacing}px`,
			'--g-item-width': metrics.itemWidthMode == 'fixed'
				? `${metrics.itemWidth}px`
				: `calc((100% - ${metrics.totalHorizontalSpacing}px) / ${metrics.cols})`,
		}
		return style
	})

	return (
		<Dynamic
			ref={setEl}
			class={styleUtils.classOptional('layout-root', props.class)}
			component={props.as || 'div'}
			style={{
				...props.style,
				'padding-inline': styleUtils.pxNonZero(getMetrics().outerPadding),
				'width': styleUtils.px(getMetrics().containerWidth),
			}}
		>
			{props.header}

			<div class='grid' style={getLayoutStyle()}>
				<For each={getConstrainItems()}>
					{function(item) {
						const Component = props.itemComponent
						return (
							<Component
								item={item}
								itemWidth={getMetrics().itemWidth}
								nativeItemWidth={getMetrics().nativeItemWidth}
							/>
						)
					}}
				</For>
			</div>

			{props.footer}
		</Dynamic>
	)
}
