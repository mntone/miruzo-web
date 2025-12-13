import type { Writable } from '~/@types/utils'
import type { ImageContext, ImageStats, ImageSummary } from '~/domain/images'

import type { ImageContextResponse, ImageStatsModel, ImageSummaryModel } from '../../types'
import { toDate } from '../../utils'

import { mapImageStatus } from './shared'

export function mapImageSummary(r: ImageSummaryModel): ImageSummary {
	const ret: Writable<ImageSummary> = {
		id: r.id,
		status: mapImageStatus(r.status),
		ingestedAt: toDate(r.ingested_at),
	}
	if (r.captured_at !== undefined) {
		ret.capturedAt = toDate(r.captured_at)
	}
	return ret
}

export function mapImageStats(r: ImageStatsModel): ImageStats {
	const ret: Writable<ImageStats> = {
		isFavorited: r.is_favorited === undefined ? false : r.is_favorited,
		score: r.score,
		viewCount: r.view_count,
		lastViewedAt: toDate(r.last_viewed_at),
	}
	return ret
}

export function mapImageContext(r: ImageContextResponse): ImageContext {
	const ret: Writable<ImageContext> = {
		image: mapImageSummary(r.image),
	}
	if (r.stats) {
		ret.stats = mapImageStats(r.stats)
	}
	return ret
}
