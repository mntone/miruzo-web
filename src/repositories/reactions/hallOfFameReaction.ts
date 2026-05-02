import type { Writable } from '~/@types/utils'
import { postGrantHallOfFame } from '~/api/images'
import type { HallOfFameStatsModel } from '~/api/types/hallOfFame'
import { toDate } from '~/api/utils'
import { hasStats, type ImageEntry, type IngestId, type StatsEntry } from '~/domain'
import { setImageStore } from '~/stores/image'

import { updateEvents } from '../event'
import { deleteOwnProperty } from '../utils'

export function applyHallOfFame(
	dst: Writable<StatsEntry>,
	src: HallOfFameStatsModel,
): void {
	if (src.hall_of_fame_at !== undefined) {
		dst.hallOfFameAt = toDate(src.hall_of_fame_at)
	} else {
		deleteOwnProperty(dst, 'hallOfFameAt')
	}
}

export function grantHallOfFameIntoStore(ingestId: IngestId): Promise<void> {
	return postGrantHallOfFame(ingestId).then(function(response) {
		setImageStore('imagesById', ingestId, function(prev: ImageEntry | undefined): ImageEntry {
			if (!hasStats(prev)) {
				throw Error('ImageEntry with stats is required to apply hall of fame stats')
			}

			const next = Object.assign({}, prev)
			applyHallOfFame(next.stats, response.stats)
			updateEvents(next)
			return next
		})
	})
}
