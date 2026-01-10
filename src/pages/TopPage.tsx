import { useContext, type Accessor } from 'solid-js'

import { Header } from '~/components/Header/Header'
import { GridImageLayout, ImageLayoutController } from '~/components/ImageLayout'
import type { LayoutChildAccessors, LayoutInterval } from '~/components/ImageLayout/shared/types'
import { TopCard } from '~/components/TopCard'
import type { ImageEntry } from '~/domain'
import { useI18n } from '~/i18n/Context'
import { NavigationStackContext } from '~/navigation/Provider'

import { ListPage } from './ListPage'
import { sectionHeader } from './TopPage.css'

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

export function TopPage() {
	const { t } = useI18n()
	const { push } = useContext(NavigationStackContext)

	return (
		<>
			<Header />
			<main>
				<ImageLayoutController
					children={CardDelegate.bind(null, '5 / 4')}
					as='section'
					header={(
						<h2
							class={sectionHeader}
							onClick={function() {
								push(ListPage, 'latest')
							}}
						>
							{t('sections.latest')}
						</h2>
					)}
					layout={GridImageLayout}
					layoutProps={{
						intervals,
						maxRows: 2,
					}}
					limit={20}
					listType='latest'
				/>

				<ImageLayoutController
					children={CardDelegate.bind(null, '4 / 5')}
					as='section'
					header={(
						<h1
							class={sectionHeader}
							onClick={function() {
								push(ListPage, 'engaged')
							}}
						>
							{t('sections.engaged')}
						</h1>
					)}
					layout={GridImageLayout}
					layoutProps={{
						intervals,
						maxRows: 1,
					}}
					limit={10}
					listType='engaged'
				/>

				<ImageLayoutController
					children={CardDelegate.bind(null, '1')}
					as='section'
					header={(
						<h1
							class={sectionHeader}
							onClick={function() {
								push(ListPage, 'hall_of_fame')
							}}
						>
							{t('sections.hall_of_fame')}
						</h1>
					)}
					layout={GridImageLayout}
					layoutProps={{
						intervals,
						maxRows: 1,
					}}
					limit={10}
					listType='hall_of_fame'
				/>
			</main>
		</>
	)
}
