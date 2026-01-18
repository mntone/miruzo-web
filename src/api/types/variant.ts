export interface VariantModel {
	readonly src: string
	readonly format: string
	readonly codecs?: string
	readonly manbytes: number
	readonly w: number
	readonly h: number
}
export type VariantModels = readonly VariantModel[]
export type VariantLayerModels = readonly VariantModels[]
