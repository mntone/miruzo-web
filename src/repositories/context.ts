import type { Writable } from '~/@types/utils'
import { fetchContextById } from '~/api/images'
import type { ContextResponse, StatsModel } from '~/api/types'
import { toDate } from '~/api/utils'
import { assertHasStats, type ImageEntry, type IngestId, type StatsEntry } from '~/domain'
import { setImageStore } from '~/stores/image'

import { updateEvents } from './event'

export function initStatsEntry(stats: StatsModel): StatsEntry {
	const newEntry: Writable<StatsEntry> = {
		score: stats.score,
		viewCount: stats.view_count,
	}
	if (stats.last_viewed_at !== undefined) {
		newEntry.lastViewedAt = toDate(stats.last_viewed_at)
	}
	if (stats.first_loved_at !== undefined) {
		newEntry.firstLovedAt = toDate(stats.first_loved_at)
	}
	if (stats.last_loved_at !== undefined) {
		newEntry.lastLovedAt = toDate(stats.last_loved_at)
	}
	if (stats.hall_of_fame_at !== undefined) {
		newEntry.hallOfFameAt = toDate(stats.hall_of_fame_at)
	}
	if (stats.view_milestone_count !== undefined) {
		newEntry.viewMilestoneCount = stats.view_milestone_count
	}
	if (stats.view_milestone_archived_at !== undefined) {
		newEntry.viewMilestoneArchivedAt = toDate(stats.view_milestone_archived_at)
	}
	return newEntry
}

export function applyContext(
	dst: Writable<ImageEntry>,
	src: ContextResponse,
): void {
	dst.ingestedAt = toDate(src.image.ingested_at)

	if (src.stats !== undefined) {
		dst.stats = initStatsEntry(src.stats)
		assertHasStats(dst)
		updateEvents(dst)
	}
}

export function loadContextIntoStore(ingestId: IngestId): Promise<void> {
	return fetchContextById(ingestId).then(function(response) {
		setImageStore('imagesById', ingestId, function(prev: ImageEntry | undefined): ImageEntry {
			if (prev === undefined) {
				throw new Error('ImageEntry must exist to apply context')
			}

			const next = Object.assign({}, prev)
			applyContext(next, response)
			return next
		})
	})
}
