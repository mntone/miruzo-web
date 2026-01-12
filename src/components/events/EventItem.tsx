import type { EventEntry } from '~/domain'
import type { I18nInstance } from '~/i18n'
import { useI18n } from '~/i18n/Context'

import * as styles from './EventItem.css'

interface EventItemProps {
	readonly entry: EventEntry
	readonly dateFormatter: (value: Date) => string
}

function renderEventLabel({ t, tp, tt }: I18nInstance, entry: EventEntry): string {
	switch (entry.type) {
	case 'love':
		return t('events.love')
	case 'love:first':
		return t('events.love:first')
	case 'post:memo':
		return tt('events.memo', entry.message)
	case 'view:milestone':
		return tp('events.view', entry.viewCount)
	}
}

export function EventItem(props: EventItemProps) {
	const i18n = useI18n()
	return (
		<li class={styles.event}>
			<span class={styles.message}>
				{renderEventLabel(i18n, props.entry)}
			</span>
			<span class={styles.separator}> · </span>
			<span class={styles.timestamp}>
				{props.dateFormatter(props.entry.occurredAt)}
			</span>
		</li>
	)
}
