import { createSignal, onMount, useContext } from 'solid-js'

import type { ImageList } from '~/domain/images'
import { useImageContext } from '~/hooks/useImageContext'
import { NavigationStackContext } from '~/navigation/Provider'

import * as styles from './ImageDetail.page.css'

interface ImageDetailPageProps {
	params: ImageList
}

export function ImageDetailPage(props: ImageDetailPageProps) {
	const { canPop, pop } = useContext(NavigationStackContext)

	const [getContext] = useImageContext(function() {
		return props.params.id
	})
	const [getHiResLoaded, setHiResLoaded] = createSignal(false)
	const [getLoResVisible, setLoResVisible] = createSignal(true)

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
					{getLoResVisible() && (
						<img
							alt={props.params.id.toString()}
							class={styles.imageLow[getLoResVisible() ? 'visible' : 'revealed']}
							decoding='sync'
							src={props.params.variants[0][0].src}
						/>
					)}
					<img
						alt={props.params.id.toString()}
						class={styles.imageHigh[getHiResLoaded() ? 'visible' : 'none']}
						decoding='async'
						loading='eager'
						src={props.params.original.src}
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
							<td>{getContext()?.stats?.viewCount ?? '???'}</td>
						</tr>
						<tr>
							<th>last_viewed_at</th>
							<td>{getContext()?.stats?.lastViewedAt?.toLocaleString() ?? '???'}</td>
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
