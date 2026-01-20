import type { Accessor } from 'solid-js'

import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { ImageLayoutController, MasonryImageLayout } from '~/components/ImageLayout'
import type { LayoutChildAccessors } from '~/components/ImageLayout/shared/types'
import type { ImageEntry, ImageListType } from '~/domain'

import { ListCard } from './ListCard'

interface ListPageProps {
	params: ImageListType
}

function CardDelegate(accessors: LayoutChildAccessors, getImage: Accessor<ImageEntry>) {
	return (
		<ListCard
			getCardWidth={accessors.getChildWidth!}
			getImage={getImage}
			getLayoutStyle={accessors.getChildStyle!}
			getNativeCardWidth={accessors.getNativeChildWidth}
		/>
	)
}

export function ListPage(props: ListPageProps) {
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary minHorizontalEdgeInset={16}>
				<ImageLayoutController
					children={CardDelegate}
					layout={MasonryImageLayout}
					layoutProps={{
						as: 'main',
					}}
					requestParams={{ type: props.params }}
					useMoreButton
				/>
			</HorizontalEdgeInsetBoundary>
		</>
	)
}
