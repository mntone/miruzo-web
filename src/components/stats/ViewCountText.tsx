import { useI18n } from '~/i18n/Context'

interface ViewCountTextProps {
	readonly value: number
}

export function ViewCountText(props: ViewCountTextProps) {
	const { tp } = useI18n()
	return (
		<span>
			{tp('labels.view', props.value)}
		</span>
	)
}
