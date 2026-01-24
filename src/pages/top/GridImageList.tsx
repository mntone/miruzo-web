import { type Accessor } from 'solid-js'

import { GridLayout, ImageLayoutHost, type LayoutMetrics } from '~/components/ImageLayout'
import type { ImageEntrySlice } from '~/domain'

import type { TopPageSectionConfig } from './config'
import * as styles from './GridImageList.css'
import { SectionHeader } from './SectionHeader'
import { TopCard } from './TopCard'

interface GridImageListProps {
	readonly initial: ImageEntrySlice
	readonly config: TopPageSectionConfig
	readonly getMetrics: Accessor<LayoutMetrics>
}

export function GridImageList(props: GridImageListProps) {
	function getImages() {
		return props.initial.entries.slice(0, props.getMetrics().cols * props.config.maxRows)
	}

	return (
		<ImageLayoutHost
			getImages={/* @once */ getImages}
			getMetrics={/* @once */ props.getMetrics}
			layout={GridLayout}
			layoutProps={{
				as: 'section',
				class: styles.section,
				header: <SectionHeader type={props.config.listType} />,
				style: {
					'--layout-item-aspect': props.config.aspectRatio,
				},
			}}
		>
			{function(item) {
				return (
					<TopCard
						item={item}
						nativeItemWidth={props.getMetrics().nativeItemWidth}
					/>
				)
			}}
		</ImageLayoutHost>
	)
}
