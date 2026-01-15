import { createMemo, createSignal, onMount, Show } from 'solid-js'

import { LoveButton, MemoButton } from '~/components/actions'
import { EventList } from '~/components/events'
import { ViewCountText } from '~/components/stats'
import type { ImageEntry, IngestId } from '~/domain'
import { mockEvents } from '~/domain/events.mock'
import { useContextResource } from '~/hooks/useContextResource'
import { useQuota } from '~/hooks/useQuota'
import { imageStore } from '~/stores/images'

import * as styles from './DetailPage.css'

interface DetailPageProps {
	params: IngestId
}

export function DetailPage(props: DetailPageProps) {
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

	let mounted = false
	onMount(function() {
		const element = getElement()
		if (element && element.complete && element.naturalWidth > 0) {
			setLoResVisible(false)
			setHiResLoaded(true)
			setSkipAnimation(true)
		}

		queueMicrotask(function() {
			mounted = true
		})
	})

	return (
		<>
			<div class={styles.container}>
				<main class={styles.main}>
					<Show when={getLoResVisible()}>
						<img
							alt={props.params.toString()}
							class={styles.imageLow[getLoResVisible() ? 'visible' : 'revealed']}
							decoding='sync'
							src={getEntry()?.variants[0][0].src}
						/>
					</Show>

					<figure class={styles.imageBox}>
						<img
							ref={setElement}
							alt={props.params.toString()}
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
									<LoveButton
										canLove={!getIsPending() && quotaStore.love.remaining !== 0}
										ingestId={props.params}
									/>
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
