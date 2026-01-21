import { useI18n } from '~/i18n/Context'

interface MoreButtonProps {
	readonly pending: boolean

	onMore(this: void): void
}

export function MoreButton(props: MoreButtonProps) {
	const { t } = useI18n()
	return (
		<button
			disabled={props.pending}
			style={{ width: '100%' }}
			type='button'
			onClick={function() {
				props.onMore()
			}}
		>
			{t(props.pending ? 'labels.state_load' : 'actions.more')}
		</button>
	)
}
