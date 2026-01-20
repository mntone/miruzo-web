import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { GridImageLayout, ImageLayoutController } from '~/components/ImageLayout'
import type { LayoutInterval } from '~/components/ImageLayout/shared/types'
import { useI18n } from '~/i18n/Context'
import type { TextTranslationKey } from '~/i18n/types'
import { Link } from '~/navigation/Link'

import { ListPage } from '../list'

import { TopCard } from './TopCard'
import * as styles from './TopPage.css'

// TopPage keeps bespoke intervals to preserve its intended grid density.
const intervals: readonly LayoutInterval[] = [
	// 1–2 columns (minItemWidth=160–, gap=8)
	{ colMin: 1, colMax: 2, minItemWidth: 160, spacing: 8 },

	// 3 columns (minItemWidth=211–320, gap=8)
	{ col: 3, minItemWidth: 211, maxItemWidth: 320, spacing: 8 },

	// 4+ columns (open-ended range)
	{ colMin: 4, itemWidth: 320, spacing: 8, outerPadding: 8 },
] as const

function SectionHeader(props: { readonly type: 'latest' | 'engaged' | 'hall_of_fame' }) {
	const { t, tt } = useI18n()
	return (
		<h2 class={styles.sectionHeader}>
			<Link
				alternateLabel={tt('labels.open', t('sections.' + props.type as TextTranslationKey))}
				class={styles.sectionButton}
				component={ListPage}
				params={props.type}
			>
				{t('sections.' + props.type as TextTranslationKey)}
			</Link>
		</h2>
	)
}

export function TopPage() {
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
						as: 'section',
						intervals,
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
						as: 'section',
						intervals,
						maxRows: 1,
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
						as: 'section',
						intervals,
						maxRows: 1,
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
