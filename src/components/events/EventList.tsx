import { createMemo, For, Show } from 'solid-js'

import type { EventEntries } from '~/domain'
import { useI18n } from '~/i18n/Context'

import { EventItem } from './EventItem'
import * as styles from './EventList.css'

const dateFormatOptions: Intl.DateTimeFormatOptions = {
	dateStyle: 'medium',
} as const

interface EventListProps {
	readonly entries?: EventEntries | undefined
}

export function EventList(props: EventListProps) {
	const { getLocale } = useI18n()
	const getDateFormatter = createMemo(function() {
		// eslint-disable-next-line @typescript-eslint/unbound-method -- Intl.DateTimeFormat#format is bound per spec.
		return new Intl.DateTimeFormat(getLocale(), dateFormatOptions).format
	})

	return (
		<Show when={props.entries}>
			{function(getEntries) {
				return (
					<ul class={styles.events}>
						<For each={getEntries()}>
							{function(entry) {
								return <EventItem dateFormatter={getDateFormatter()} entry={entry} />
							}}
						</For>
					</ul>
				)
			}}
		</Show>
	)
}
