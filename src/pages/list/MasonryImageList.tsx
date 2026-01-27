import { createSignal, Show, type Accessor } from 'solid-js'

import { ImageLayoutHost, MasonryLayout, type LayoutMetrics } from '~/components/ImageLayout'
import type { ImageEntrySlice } from '~/domain'
import { useImageEntryList, type ImageEntryListOptions } from '~/hooks/useImageEntryList'
import { shouldPlayEntranceAnimation, useNavigation } from '~/navigation'
import { prefersReducedMotion } from '~/utils/motion'

import { ListCard } from './ListCard'
import { MoreButton } from './MoreButton'

interface MasonryImageListProps {
	readonly initial: ImageEntrySlice
	readonly options: ImageEntryListOptions
	readonly getMetrics: Accessor<LayoutMetrics>
}

export function MasonryImageList(props: MasonryImageListProps) {
	const { getTransitionInfo } = useNavigation()
	const enableEntranceAnimation = !prefersReducedMotion() && shouldPlayEntranceAnimation(getTransitionInfo())
	const [isAnimating, setIsAnimating] = createSignal(enableEntranceAnimation)

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
			classList={{
				'entrance-animation': isAnimating(),
			}}
			getImages={images}
			getMetrics={/* @once */ props.getMetrics}
			layout={MasonryLayout}
			layoutProps={/* @once */ {
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
				onAnimationEnd(e) {
					if (e.currentTarget === e.target) {
						setIsAnimating(false)
					}
				},
			}}
		>
			{function(item, _, getItemStyle) {
				return (
					<ListCard
						getItemStyle={/* @once */ getItemStyle!}
						item={item}
						itemWidth={props.getMetrics().itemWidth}
						nativeItemWidth={props.getMetrics().nativeItemWidth}
					/>
				)
			}}
		</ImageLayoutHost>
	)
}
