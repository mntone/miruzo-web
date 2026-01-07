export interface ImageSummaryModel {
	readonly id: number
	readonly ingested_at: string
}

export interface StatsModel {
	readonly score: number
	readonly view_count: number
	readonly last_viewed_at?: string
	readonly first_loved_at?: string
	readonly last_loved_at?: string
	readonly hall_of_fame_at?: string
	readonly view_milestone_count?: number
	readonly view_milestone_archived_at?: string
}

export interface ContextResponse {
	readonly image: ImageSummaryModel
	readonly stats?: StatsModel
}
