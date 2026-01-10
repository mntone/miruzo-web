import type { Accessor } from 'solid-js'

import type { ImageListType } from '~/api/types'
import { Header } from '~/components/Header/Header'
import { ImageLayoutController, MasonryImageLayout } from '~/components/ImageLayout'
import type { LayoutChildAccessors } from '~/components/ImageLayout/shared/types'
import { ListCard } from '~/components/ListCard'
import type { ImageEntry } from '~/domain'

interface ListPageProps {
	params: ImageListType
}

function CardDelegate(accessors: LayoutChildAccessors, getImage: Accessor<ImageEntry>) {
	return (
		<ListCard
			getCardWidth={accessors.getChildWidth}
			getImage={getImage}
			getLayoutStyle={accessors.getChildStyle}
			getNativeCardWidth={accessors.getNativeChildWidth}
		/>
	)
}

export function ListPage(props: ListPageProps) {
	return (
		<>
			<Header />
			<ImageLayoutController
				children={CardDelegate}
				as='main'
				layout={MasonryImageLayout}
				listType={props.params}
				useMoreButton
			/>
		</>
	)
}
