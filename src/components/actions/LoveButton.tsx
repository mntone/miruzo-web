import { Show } from 'solid-js'

import type { IngestId } from '~/domain'
import { useLoveAction } from '~/hooks/useLoveAction'
import { useI18n } from '~/i18n/Context'

interface LoveButtonProps {
	readonly canLove: boolean
	readonly ingestId: IngestId
	readonly remainingLoves: number
}

export function LoveButton(props: LoveButtonProps) {
	const { t, tp } = useI18n()

	const [love, getIsPending] = useLoveAction(function() {
		return props.ingestId
	})

	function getDescriptionId() {
		return `love-remaining-${props.ingestId}`
	}

	function getTooltipLabel() {
		return tp('labels.love_remaining', props.remainingLoves)
	}

	return (
		<>
			<button
				aria-describedby={props.remainingLoves !== 0 ? getDescriptionId() : undefined}
				disabled={getIsPending() || !props.canLove}
				title={props.remainingLoves !== 0 ? getTooltipLabel() : undefined}
				type='button'
				onClick={love}
			>
				{t('actions.love')}
			</button>
			<Show when={props.remainingLoves !== 0}>
				<span class='screen-reader-only' id={getDescriptionId()}>
					{getTooltipLabel()}
				</span>
			</Show>
		</>
	)
}
