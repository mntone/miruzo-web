import { Header } from '~/components/Header/Header'
import { HorizontalEdgeInsetBoundary } from '~/components/HorizontalEdgeInsetBoundary'
import { ImageLayoutController, MasonryImageLayout } from '~/components/ImageLayout'
import type { ImageListType } from '~/domain'

import { ListCard } from './ListCard'

interface ListPageProps {
	params: ImageListType
}

export function ListPage(props: ListPageProps) {
	return (
		<>
			<Header />
			<HorizontalEdgeInsetBoundary minHorizontalEdgeInset={16}>
				<ImageLayoutController
					itemComponent={ListCard}
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
