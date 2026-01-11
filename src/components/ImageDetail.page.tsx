import { createMemo, createSignal, onMount, Show } from 'solid-js'

import type { IngestId } from '~/domain'
import { useContextResource } from '~/hooks/useContextResource'
import { imageStore } from '~/stores/images'

import { LoveButton, MemoButton } from './actions'
import * as styles from './ImageDetail.page.css'
import { ViewCountText } from './stats'

interface ImageDetailPageProps {
	params: IngestId
}

export function ImageDetailPage(props: ImageDetailPageProps) {
	const getEntry = createMemo(function() {
		return imageStore.imagesById[props.params]
	})
	const [getHiResLoaded, setHiResLoaded] = createSignal(false)
	const [getLoResVisible, setLoResVisible] = createSignal(true)
	const [getSkipAnimation, setSkipAnimation] = createSignal(false)
	const [getElement, setElement] = createSignal<HTMLImageElement | undefined>(undefined)

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
							src={getEntry().variants[0][0].src}
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
							src={getEntry().original.src}
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
					<div class='button-group'>
						<LoveButton />
						{import.meta.env.DEV && <MemoButton />}

						<Show when={getEntry()?.stats?.viewCount}>
							{function(getViewCount) {
								return <ViewCountText value={getViewCount()} />
							}}
						</Show>
					</div>
				</aside>
			</div>
		</>
	)
}
