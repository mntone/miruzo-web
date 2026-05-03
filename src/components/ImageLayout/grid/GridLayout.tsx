import { createMemo, For } from 'solid-js'
import type { JSX } from 'solid-js/h/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import * as styleUtils from '../../shared/style'

import type { GridLayoutProps } from './types'

export function GridLayout<Item>(props: GridLayoutProps<Item>) {
	const getLayoutStyle = createMemo(function() {
		const metrics = props.getMetrics()
		const style: JSX.CSSProperties = {
			'gap': `${metrics.innerGap}px ${metrics.innerGap}px`,
			'width': `${metrics.trackInnerWidth}px`,
			'--layout-item-width': metrics.itemWidthMode == 'fixed'
				? `${metrics.itemWidth}px`
				: `calc((100% - ${metrics.trackInnerGapWidth}px)/${metrics.cols})`,
			'--layout-padding': styleUtils.pxNonZero(props.getMetrics().outerGap),
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
				width: styleUtils.px(props.getMetrics().layoutWidth),
			}}
			onAnimationEnd={/* @once */ props.onAnimationEnd}
		>
			{/* @once */ props.header}

			<div
				ref={props.ref}
				class='grid'
				role='grid'
				style={getLayoutStyle()}
				// eslint-disable-next-line solid/reactivity -- fixed at setup
				onFocusIn={props.onFocusIn}
				// eslint-disable-next-line solid/reactivity -- fixed at setup
				onFocusOut={props.onFocusOut}
				// eslint-disable-next-line solid/reactivity -- fixed at setup
				onKeyDown={props.onKeyDown}
			>
				<For each={/* @once */ props.getItems()}>
					{/* @once */ props.children}
				</For>
			</div>

			{/* @once */ props.footer}
		</Dynamic>
	)
}
