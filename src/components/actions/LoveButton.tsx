import type { IngestId } from '~/domain'
import { useLoveAction } from '~/hooks/useLoveAction'
import { useI18n } from '~/i18n/Context'

interface LoveButtonProps {
	ingestId: IngestId
}

export function LoveButton(props: LoveButtonProps) {
	const { t } = useI18n()

	const [love, getIsPending] = useLoveAction(function() {
		return props.ingestId
	})

	return (
		<button
			disabled={getIsPending()}
			type='button'
			onClick={love}
		>
			{t('actions.love')}
		</button>
	)
}
