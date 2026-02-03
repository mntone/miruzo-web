import { createMemo, createSignal, type Accessor } from 'solid-js'

import { GridLayout, ImageLayoutHost, type LayoutMetrics } from '~/components/ImageLayout'
import { useGridRovingTabIndex } from '~/components/ImageLayout/grid/useGridRovingTabIndex'
import type { ImageEntrySlice } from '~/domain'

import type { TopPageSectionConfig } from './config'
import * as styles from './GridImageList.css'
import { SectionHeader } from './SectionHeader'
import { TopCard } from './TopCard'

interface GridImageListProps {
	readonly enableEntranceAnimation: boolean
	readonly initial: ImageEntrySlice
	readonly config: TopPageSectionConfig
	readonly getMetrics: Accessor<LayoutMetrics>
}

export function GridImageList(props: GridImageListProps) {
	const getColumnCount = createMemo(function() {
		return props.getMetrics().cols
	})

	const getImages = createMemo(function() {
		return props.initial.entries.slice(0, getColumnCount() * props.config.maxRows)
	})

	const [containerProps, getItemProps] = useGridRovingTabIndex({
		getColumnCount,
		getItemCount() {
			return getImages().length
		},
	})

	// eslint-disable-next-line solid/reactivity -- fixed at setup
	const [isAnimating, setIsAnimating] = createSignal(props.enableEntranceAnimation)

	return (
		<ImageLayoutHost
			classList={{
				'entrance-animation': isAnimating(),
			}}
			getImages={/* @once */ getImages}
			getMetrics={/* @once */ props.getMetrics}
			layout={GridLayout}
			layoutProps={/* @once */ {
				...containerProps,
				as: 'section',
				class: styles.section,
				header: <SectionHeader type={props.config.listType} />,
				style: {
					'--layout-item-aspect': props.config.aspectRatio,
				},
				onAnimationEnd(e) {
					if (e.currentTarget === e.target) {
						setIsAnimating(false)
					}
				},
			}}
		>
			{function(item, getIndex) {
				return (
					<TopCard
						{...getItemProps(getIndex())}
						item={item}
						nativeItemWidth={props.getMetrics().nativeItemWidth}
					/>
				)
			}}
		</ImageLayoutHost>
	)
}
