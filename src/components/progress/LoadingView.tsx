import { untrack } from 'solid-js'

import { useI18n } from '~/i18n/Context'

import { LoadingIndicator } from './LoadingIndicator'
import * as styles from './LoadingView.css'

function getDelayInMilliseconds(step: number | undefined): number {
	return Math.max(0, 221 * (step ?? 3))
}

interface LoadingViewProps {
	readonly delayStep?: number
	readonly height?: string
}

export function LoadingView(props: LoadingViewProps) {
	const delay = untrack(function() {
		return getDelayInMilliseconds(props?.delayStep)
	})

	const { t } = useI18n()
	return (
		<div
			class={/* @once */ 'vstack ' + styles.root}
			role='status'
			style={{
				'animation-delay': `${delay}ms`,
				'height': props.height,
			}}
		>
			<LoadingIndicator size={48} />
			<span>{t('labels.state_load')}</span>
		</div>
	)
}
