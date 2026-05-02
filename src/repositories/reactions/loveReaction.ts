import type { Writable } from '~/@types/utils'
import { postLove } from '~/api/images'
import type { LoveResponse, LoveStatsModel } from '~/api/types/love'
import type { QuotaItem } from '~/api/types/quota'
import { toDate } from '~/api/utils'
import { hasStats, type ImageEntry, type ImageEntryWithStats, type IngestId, type QuotaEntry, type StatsEntry } from '~/domain'
import { setImageStore } from '~/stores/image'
import { setQuotaStore } from '~/stores/quota'

import { updateEvents } from '../event'
import { deleteOwnProperty } from '../utils'

export function applyLove(
	dst: Writable<StatsEntry>,
	src: LoveStatsModel,
): void {
	dst.score = src.score

	if (src.last_loved_at !== undefined) {
		dst.lastLovedAt = toDate(src.last_loved_at)
	} else {
		deleteOwnProperty(dst, 'lastLovedAt')
	}

	if (src.first_loved_at !== undefined) {
		dst.firstLovedAt = toDate(src.first_loved_at)
	} else {
		if (import.meta.env.DEV && src.last_loved_at !== undefined) {
			console.warn('Invalid firstLovedAt: undefined')
		}
		deleteOwnProperty(dst, 'firstLovedAt')
	}
}

export function applyLoveResponse(
	dst: Writable<ImageEntryWithStats>,
	src: LoveResponse,
): void {
	applyLove(dst.stats, src.stats)

	updateEvents(dst)
}

export function applyLoveQuota(
	dst: Writable<QuotaEntry>,
	src: QuotaItem,
): void {
	dst.resetAt = toDate(src.reset_at)
	dst.limit = src.limit
	dst.remaining = src.remaining
	dst.used = src.limit - src.remaining
}

export function loveImageIntoStore(ingestId: IngestId): Promise<void> {
	return postLove(ingestId).then(function(response) {
		setImageStore('imagesById', ingestId, function(prev: ImageEntry | undefined): ImageEntry {
			if (!hasStats(prev)) {
				throw Error('ImageEntry with stats is required to apply love stats')
			}

			const next = Object.assign({}, prev)
			applyLoveResponse(next, response)
			return next
		})

		setQuotaStore('love', function(prev: QuotaEntry): QuotaEntry {
			const next = Object.assign({}, prev)
			applyLoveQuota(next, response.quota)
			return next
		})
	})
}
