import type { ImageListType } from '~/domain'

import type { VariantLayerModels, VariantModel } from './variant'

export interface ImageListRequest {
	readonly type: ImageListType
	readonly limit: number
	readonly cursor?: string
	readonly excludeFormats?: readonly string[]
}

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
