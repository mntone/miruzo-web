import { createSignal, onCleanup, Show } from 'solid-js'

import { useI18n } from '~/i18n/Context'

import { LoadingIndicator } from './LoadingIndicator'
import * as styles from './LoadingView.css'

interface LoadingViewProps {
	readonly delayStep?: number
	readonly height?: string
}

export function LoadingView(props: LoadingViewProps) {
	// eslint-disable-next-line solid/reactivity -- fixed at setup
	const delay = Math.max(0, 221 * (props.delayStep ?? 3))
	const noDelay = delay === 0
	const [getIsVisible, setIsVisible] = createSignal(noDelay)

	if (!noDelay) {
		const timeoutId = window.setTimeout(function() {
			setIsVisible(true)
		}, delay)
		onCleanup(function() {
			window.clearTimeout(timeoutId)
		})
	}

	const { t } = useI18n()
	return (
		<Show when={getIsVisible()}>
			<div
				class={/* @once */ 'vstack ' + styles.root}
				role='status'
				style={/* @once */{
					height: props.height,
				}}
			>
				<LoadingIndicator size={48} />
				<span>{t('labels.state_load')}</span>
			</div>
		</Show>
	)
}
