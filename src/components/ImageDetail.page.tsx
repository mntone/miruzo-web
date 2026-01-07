import { createMemo, createSignal, onMount, Show, useContext } from 'solid-js'

import type { IngestId } from '~/domain'
import { useContextResource } from '~/hooks/useContextResource'
import { NavigationStackContext } from '~/navigation/Provider'
import { imageStore } from '~/stores/images'

import * as styles from './ImageDetail.page.css'

interface ImageDetailPageProps {
	params: IngestId
}

export function ImageDetailPage(props: ImageDetailPageProps) {
	const { canPop, pop } = useContext(NavigationStackContext)

	const getEntry = createMemo(function() {
		return imageStore.imagesById[props.params]
	})
	const [getHiResLoaded, setHiResLoaded] = createSignal(false)
	const [getLoResVisible, setLoResVisible] = createSignal(true)

	useContextResource(function() {
		return props.params
	})

	let mounted = false
	onMount(function() {
		queueMicrotask(function() {
			mounted = true
		})
	})

	return (
		<div class={styles.sheet}>
			<header class={styles.header}>
				<p class={styles.headerTitle}>Image Detail</p>
				<button
					class={styles.closeButton}
					disabled={!canPop()}
					onClick={function() {
						if (mounted) {
							pop()
						}
					}}
				>
					Close
				</button>
			</header>

			<main class={styles.container}>
				<div class={styles.content}>
					<Show when={getLoResVisible()}>
						<img
							alt={props.params.toString()}
							class={styles.imageLow[getLoResVisible() ? 'visible' : 'revealed']}
							decoding='sync'
							src={getEntry().variants[0][0].src}
						/>
					</Show>

					<img
						alt={props.params.toString()}
						class={styles.imageHigh[getHiResLoaded() ? 'visible' : 'none']}
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
				</div>

				<table class={styles.meta}>
					<tbody>
						<tr>
							<th>view_count</th>
							<td>{getEntry()?.stats?.viewCount ?? '???'}</td>
						</tr>
						<tr>
							<th>last_viewed_at</th>
							<td>{getEntry()?.stats?.lastViewedAt?.toLocaleString() ?? '???'}</td>
						</tr>
					</tbody>
				</table>
			</main>
		</div>
	)
}
ImageDetailPage.options = {
	overlay: true,
} as const
