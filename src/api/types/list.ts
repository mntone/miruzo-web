import type { VariantLayerModels, VariantModel } from './variant'

export interface ImageListModel {
	readonly id: number
	readonly original: VariantModel
	readonly fallback?: VariantModel
	readonly variants: VariantLayerModels
}

export interface ImageListResponse {
	readonly items?: readonly ImageListModel[]
	readonly cursor?: string
}
