import { createMemo, createSignal, onMount, Show, type Accessor, type JSX } from 'solid-js'

import { HallOfFameButton, LoveButton, MemoButton } from '~/components/actions'
import { EventList } from '~/components/events'
import { ViewCountText } from '~/components/stats'
import { canGrantHallOfFame } from '~/domain'
import type { ImageEntry, IngestId, StatsEntry } from '~/domain'
import { mockEvents } from '~/domain/event.mock'
import { useContextResource } from '~/hooks/useContextResource'
import { useQuota } from '~/hooks/useQuota'
import { useSurfaceScope } from '~/hooks/useSurfaceScope'
import { imageStore } from '~/stores/image'

import * as styles from './DetailPage.css'

interface DetailPageProps {
	params: IngestId
}

function renderReactionButton(
	ingestId: IngestId,
	getStats: Accessor<StatsEntry>,
	remainingLoves: number,
	getQuotaPending: Accessor<boolean>,
): JSX.Element {
	const stats = getStats()

	if (stats.hallOfFameAt !== undefined) {
		return undefined
	}

	if (canGrantHallOfFame(stats)) {
		return <HallOfFameButton ingestId={ingestId} />
	}

	return (
		<LoveButton
			canLove={!getQuotaPending() && remainingLoves !== 0}
			ingestId={ingestId}
			remainingLoves={remainingLoves}
		/>
	)
}

export function DetailPage(props: DetailPageProps) {
	useSurfaceScope(function() {
		return 'secondary'
	})

	const getEntry = createMemo(function(): ImageEntry | undefined {
		return imageStore.imagesById[props.params]
	})
	const [getHiResLoaded, setHiResLoaded] = createSignal(false)
	const [getLoResVisible, setLoResVisible] = createSignal(true)
	const [getSkipAnimation, setSkipAnimation] = createSignal(false)
	const [getElement, setElement] = createSignal<HTMLImageElement | undefined>(undefined)

	const { quotaStore, getIsPending } = useQuota()

	useContextResource(function() {
		return props.params
	})

	onMount(function() {
		const element = getElement()
		if (element && element.complete && element.naturalWidth > 0) {
			setLoResVisible(false)
			setHiResLoaded(true)
			setSkipAnimation(true)
		}
	})

	return (
		<>
			<div class={styles.container}>
				<main class={styles.main}>
					<Show when={getLoResVisible()}>
						<img
							alt={`${props.params}`}
							class={styles.imageLow[getLoResVisible() ? 'visible' : 'revealed']}
							decoding='sync'
							src={getEntry()?.variants[0][0].src}
						/>
					</Show>

					<figure class={styles.imageBox}>
						<img
							ref={setElement}
							alt={`${props.params}`}
							class={styles.imageHigh[getHiResLoaded() ? 'visible' : 'none']}
							classList={{
								[styles.imageHighInstant]: getSkipAnimation(),
							}}
							decoding='async'
							loading='eager'
							src={getEntry()?.original.src}
							onLoad={function() {
								setHiResLoaded(true)
							}}
							onTransitionEnd={function() {
								setLoResVisible(false)
							}}
						/>
					</figure>
				</main>

				<aside class={styles.aside}>
					<Show when={getEntry()?.stats}>
						{function(getStats) {
							return (
								<div class='button-group'>
									{renderReactionButton(
										props.params,
										getStats,
										quotaStore.love.remaining,
										getIsPending,
									)}
									{import.meta.env.DEV && <MemoButton />}

									<ViewCountText value={getStats().viewCount} />
								</div>
							)
						}}
					</Show>

					<EventList entries={
						import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_EVENTS === 'true'
							? mockEvents
							: getEntry()?.events
					}
					/>
				</aside>
			</div>
		</>
	)
}
