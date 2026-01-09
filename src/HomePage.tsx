import { type Accessor } from 'solid-js'

import { Header } from '~/components/Header/Header'
import { ImageLayoutController, MasonryImageLayout } from '~/components/ImageLayout'

import { ImageCard } from './components/ImageCard'
import type { LayoutChildAccessors } from './components/ImageLayout/shared/types'
import type { ImageEntry } from './domain'

function CardDelegate(accessors: LayoutChildAccessors, getImage: Accessor<ImageEntry>) {
	return (
		<ImageCard
			getCardWidth={accessors.getChildWidth}
			getImage={getImage}
			getLayoutStyle={accessors.getChildStyle}
			getNativeCardWidth={accessors.getNativeChildWidth}
		/>
	)
}

export function HomePage() {
	return (
		<>
			<Header />
			<ImageLayoutController
				children={CardDelegate}
				as='main'
				layout={MasonryImageLayout}
				listType='latest'
				useMoreButton
			/>
		</>
	)
}
