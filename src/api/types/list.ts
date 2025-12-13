export interface VariantModel {
	readonly src: string
	readonly format: string
	readonly codecs?: string
	readonly manbytes: number
	readonly w: number
	readonly h: number
}

export type VariantsModel = readonly (readonly VariantModel[])[]

export interface ImageListModel {
	readonly id: number
	readonly status?: number
	readonly original: VariantModel
	readonly fallback?: VariantModel
	readonly variants: VariantsModel
}

export interface ImageListResponse {
	readonly items: readonly ImageListModel[]
	readonly cursor?: string
}
