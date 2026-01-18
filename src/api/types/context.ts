import type { VariantLayerModels, VariantModel } from './variant'

export type ContextLevel = 'default' | 'rich'

export interface ContextRequest {
	readonly ingestId: number
	readonly level?: ContextLevel
}

export interface ImageSummaryModel {
	readonly level?: 'rich'
	readonly id: number
	readonly ingested_at: string
}

export interface ImageRichModel extends ImageSummaryModel {
	readonly level: 'rich'
	readonly original: VariantModel
	readonly fallback?: VariantModel
	readonly variants: VariantLayerModels
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

export interface ContextResponse<ImageModel extends ImageSummaryModel = ImageSummaryModel> {
	readonly image: ImageModel
	readonly stats?: StatsModel
}
