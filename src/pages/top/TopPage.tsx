import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { GridImageLayout, ImageLayoutController, type ImageLayoutControllerProps } from '~/components/ImageLayout'
import { useSurfaceScope } from '~/hooks/useSurfaceScope'

import { topPageIntervals } from './interval'
import { SectionHeader } from './SectionHeader'
import { TopCard } from './TopCard'
import * as styles from './TopPage.css'

export function TopPage() {
	useSurfaceScope(function() {
		return 'section'
	})

	const baseLayoutProps: (ImageLayoutControllerProps<typeof GridImageLayout>)['layoutProps'] = {
		as: 'section',
		class: styles.section,
		intervals: topPageIntervals,
		maxRows: 1,
	}
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary
				as='main'
				minHorizontalEdgeInset={16}
			>
				<ImageLayoutController
					header={<SectionHeader type='latest' />}
					itemComponent={TopCard}
					layout={GridImageLayout}
					layoutProps={{
						...baseLayoutProps,
						maxRows: 2,
						style: {
							'--g-item-aspect': '1.25',
						},
					}}
					requestParams={{
						type: 'latest',
						limit: 20,
					}}
				/>

				<ImageLayoutController
					header={<SectionHeader type='engaged' />}
					itemComponent={TopCard}
					layout={GridImageLayout}
					layoutProps={{
						...baseLayoutProps,
						style: {
							'--g-item-aspect': '.8',
						},
					}}
					requestParams={{
						type: 'engaged',
						limit: 10,
					}}
				/>

				<ImageLayoutController
					header={<SectionHeader type='hall_of_fame' />}
					itemComponent={TopCard}
					layout={GridImageLayout}
					layoutProps={{
						...baseLayoutProps,
						style: {
							'--g-item-aspect': '1',
						},
					}}
					requestParams={{
						type: 'hall_of_fame',
						limit: 10,
					}}
				/>
			</HorizontalEdgeInsetBoundary>
		</>
	)
}
