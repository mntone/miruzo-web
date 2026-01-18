import type { Accessor } from 'solid-js'

import { Header } from '~/components/Header/Header'
import { GridImageLayout, ImageLayoutController } from '~/components/ImageLayout'
import type { LayoutChildAccessors, LayoutInterval } from '~/components/ImageLayout/shared/types'
import { TopCard } from '~/components/TopCard'
import type { ImageEntry } from '~/domain'
import { useI18n } from '~/i18n/Context'
import type { TextTranslationKey } from '~/i18n/types'
import { Link } from '~/navigation/Link'

import { ListPage } from './ListPage'
import * as styles from './TopPage.css'

const intervals: readonly LayoutInterval[] = [
	{ colMin: 1, colMax: 2, minItemWidth: 160, maxItemWidth: Infinity, spacing: 8, outerPadding: 12 },
	{ col: 3, minItemWidth: 240, maxItemWidth: 320, spacing: 8, outerPadding: 16 },
	{ colMin: 4, itemWidth: 320, spacing: 8, outerPadding: 24 },
]

function CardDelegate(
	aspect: string,
	accessors: LayoutChildAccessors,
	getImage: Accessor<ImageEntry>,
) {
	return (
		<TopCard
			aspectRatio={aspect}
			getImage={getImage}
			getLayoutStyle={accessors.getChildStyle}
			getNativeCardWidth={accessors.getNativeChildWidth}
		/>
	)
}

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
			<main>
				<ImageLayoutController
					children={CardDelegate.bind(null, '5 / 4')}
					as='section'
					header={<SectionHeader type='latest' />}
					layout={GridImageLayout}
					layoutProps={{
						intervals,
						maxRows: 2,
					}}
					requestParams={{
						type: 'latest',
						limit: 20,
					}}
				/>

				<ImageLayoutController
					children={CardDelegate.bind(null, '4 / 5')}
					as='section'
					header={<SectionHeader type='engaged' />}
					layout={GridImageLayout}
					layoutProps={{
						intervals,
						maxRows: 1,
					}}
					requestParams={{
						type: 'engaged',
						limit: 10,
					}}
				/>

				<ImageLayoutController
					children={CardDelegate.bind(null, '1')}
					as='section'
					header={<SectionHeader type='hall_of_fame' />}
					layout={GridImageLayout}
					layoutProps={{
						intervals,
						maxRows: 1,
					}}
					requestParams={{
						type: 'hall_of_fame',
						limit: 10,
					}}
				/>
			</main>
		</>
	)
}
