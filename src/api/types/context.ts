export interface ImageSummaryModel {
	readonly id: number
	readonly status?: number
	readonly captured_at?: string
	readonly ingested_at: string
}

export interface ImageStatsModel {
	readonly is_favorited?: boolean
	readonly score: number
	readonly view_count: number
	readonly last_viewed_at: string
}

export interface ImageContextResponse {
	readonly image: ImageSummaryModel
	readonly stats?: ImageStatsModel
}
