import { Show, untrack, type Accessor } from 'solid-js'

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
	const options = untrack(function() {
		return props.options
	})

	const {
		images,
		isPending,
		hasNext,
		loadNext,
	} = useImageEntryList(props.initial, options)

	return (
		<>
			<ImageLayoutHost
				getMetrics={/* @once */ props.getMetrics}
				itemComponent={ListCard}
				items={images()}
				layout={MasonryLayout}
				layoutProps={{
					as: 'main',
				}}
			/>

			<Show when={hasNext()}>
				<MoreButton
					pending={isPending()}
					onMore={loadNext}
				/>
			</Show>
		</>
	)
}
