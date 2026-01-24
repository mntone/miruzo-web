import { Show, type Accessor } from 'solid-js'

import { ImageLayoutHost, MasonryLayout, type LayoutMetrics } from '~/components/ImageLayout'
import type { ImageEntrySlice } from '~/domain'
import { useImageEntryList, type ImageEntryListOptions } from '~/hooks/useImageEntryList'

import { ListCard } from './ListCard'
import { MoreButton } from './MoreButton'

interface MasonryImageListProps {
	readonly initial: ImageEntrySlice
	readonly options: ImageEntryListOptions
	readonly getMetrics: Accessor<LayoutMetrics>
}

export function MasonryImageList(props: MasonryImageListProps) {
	// eslint-disable-next-line solid/reactivity -- fixed at setup
	const options = props.options
	const {
		images,
		isPending,
		hasNext,
		loadNext,
	} = useImageEntryList(props.initial, options)

	return (
		<ImageLayoutHost
			getImages={images}
			getMetrics={/* @once */ props.getMetrics}
			itemComponent={ListCard}
			layout={MasonryLayout}
			layoutProps={{
				as: 'main',
				footer: (
					<Show when={hasNext()}>
						<MoreButton
							pending={isPending()}
							onMore={loadNext}
						/>
					</Show>
				),
				style: {
					'margin-bottom': '16px',
				},
			}}
		/>
	)
}
