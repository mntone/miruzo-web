import { Show, untrack } from 'solid-js'

import { MasonryImageLayout } from '~/components/ImageLayout'
import { ImageLayoutHost } from '~/components/ImageLayout/ImageLayoutHost'
import type { ImageEntrySlice } from '~/domain'
import { useImageEntryList, type ImageEntryListOptions } from '~/hooks/useImageEntryList'

import { ListCard } from './ListCard'
import { MoreButton } from './MoreButton'

interface MasonryImageListProps {
	readonly initial: ImageEntrySlice
	readonly options: ImageEntryListOptions
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
				itemComponent={ListCard}
				items={images()}
				layout={MasonryImageLayout}
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
