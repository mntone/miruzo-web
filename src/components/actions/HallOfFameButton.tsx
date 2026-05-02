import type { IngestId } from '~/domain'
import { useHallOfFameGrantedAction } from '~/hooks/useHallOfFameGrantedAction'
import { useI18n } from '~/i18n/Context'

interface HallOfFameButtonProps {
	readonly ingestId: IngestId
}

export function HallOfFameButton(props: HallOfFameButtonProps) {
	const { t } = useI18n()

	const [hallOfFameGranted, getIsPending] = useHallOfFameGrantedAction(function() {
		return props.ingestId
	})

	return (
		<button
			class='button'
			disabled={getIsPending()}
			type='button'
			onClick={hallOfFameGranted}
		>
			{t('actions.hall_of_fame')}
		</button>
	)
}
