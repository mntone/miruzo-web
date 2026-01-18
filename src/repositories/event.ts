import type { Writable } from '~/@types/utils'
import type { ImageEntryWithStats } from '~/domain'
import { tryDeriveEventsFromStats } from '~/domain/event'

import { deleteOwnProperty } from './utils'

export function updateEvents(dst: Writable<ImageEntryWithStats>): void {
	const result = tryDeriveEventsFromStats(dst.stats)
	if (result.status === 'success') {
		dst.events = result.value
	} else {
		if (import.meta.env.DEV) {
			console.warn('Invalid event stats:', result.error, dst.stats)
		}
		deleteOwnProperty(dst, 'events')
	}
}
