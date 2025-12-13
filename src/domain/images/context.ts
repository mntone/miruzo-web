import type { ImageStatus } from './shared'

export interface ImageSummary {
	readonly id: number
	readonly status: ImageStatus
	readonly capturedAt?: Date
	readonly ingestedAt: Date
}

export interface ImageStats {
	readonly isFavorited: boolean
	readonly score: number
	readonly viewCount: number
	readonly lastViewedAt: Date | undefined
}

export interface ImageContext {
	readonly image: ImageSummary
	readonly stats?: ImageStats
}
