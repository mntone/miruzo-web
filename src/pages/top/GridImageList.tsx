import { GridLayout } from '~/components/ImageLayout'
import { ImageLayoutHost } from '~/components/ImageLayout/ImageLayoutHost'
import type { ImageEntrySlice } from '~/domain'

import type { TopPageSectionConfig } from './config'
import * as styles from './GridImageList.css'
import { topPageIntervals } from './interval'
import { SectionHeader } from './SectionHeader'
import { TopCard } from './TopCard'

interface GridImageListProps {
	readonly initial: ImageEntrySlice
	readonly config: TopPageSectionConfig
}

export function GridImageList(props: GridImageListProps) {
	return (
		<ImageLayoutHost
			itemComponent={TopCard}
			items={props.initial.entries}
			layout={GridLayout}
			layoutProps={{
				as: 'section',
				class: styles.section,
				header: <SectionHeader type={props.config.listType} />,
				intervals: topPageIntervals,
				maxRows: props.config.maxRows,
				style: {
					'--g-item-aspect': props.config.aspectRatio,
				},
			}}
		/>
	)
}
