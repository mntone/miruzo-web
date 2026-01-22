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
	return (
		<ImageLayoutHost
			getMetrics={/* @once */ props.getMetrics}
			itemComponent={TopCard}
			items={props.initial.entries}
			layout={GridLayout}
			layoutProps={{
				as: 'section',
				class: styles.section,
				header: <SectionHeader type={props.config.listType} />,
				maxRows: props.config.maxRows,
				style: {
					'--g-item-aspect': props.config.aspectRatio,
				},
			}}
		/>
	)
}
