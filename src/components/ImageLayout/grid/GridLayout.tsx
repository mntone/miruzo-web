import { createMemo, For } from 'solid-js'
import type { JSX } from 'solid-js/h/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import * as styleUtils from '../../shared/style'

import type { GridLayoutProps } from './types'

export function GridLayout<Item>(props: GridLayoutProps<Item>) {
	const getLayoutStyle = createMemo(function() {
		const metrics = props.getMetrics()
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
			class={/* @once */ styleUtils.classOptional('layout-root', props.class)}
			component={/* @once */ props.as || 'div'}
			style={{
				...props.style,
				'padding-inline': styleUtils.pxNonZero(props.getMetrics().outerPadding),
				'width': styleUtils.px(props.getMetrics().containerWidth),
			}}
		>
			{/* @once */ props.header}

			<div class='grid' style={getLayoutStyle()}>
				<For each={props.getItems()}>
					{function(item) {
						const Component = props.itemComponent
						return (
							<Component
								item={item}
								itemWidth={props.getMetrics().itemWidth}
								nativeItemWidth={props.getMetrics().nativeItemWidth}
							/>
						)
					}}
				</For>
			</div>

			{/* @once */ props.footer}
		</Dynamic>
	)
}
