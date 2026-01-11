import { useI18n } from '~/i18n/Context'

export function MemoButton() {
	const { t } = useI18n()
	return (
		<button type='button'>
			{t('actions.memo')}
		</button>
	)
}
