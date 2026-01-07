export interface VariantModel {
	readonly src: string
	readonly format: string
	readonly codecs?: string
	readonly manbytes: number
	readonly w: number
	readonly h: number
}

export type VariantLayerModels = readonly (readonly VariantModel[])[]

export interface ImageListModel {
	readonly id: number
	readonly original: VariantModel
	readonly fallback?: VariantModel
	readonly variants: VariantLayerModels
}

export interface ImageListResponse {
	readonly items: readonly ImageListModel[]
	readonly cursor?: string
}
