import { useI18n } from '~/i18n/Context'

export function LoveButton() {
	const { t } = useI18n()
	return (
		<button type='button'>
			{t('actions.love')}
		</button>
	)
}
