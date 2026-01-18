export interface VariantEntry {
	readonly src: string
	readonly format: string
	readonly codecs?: string
	readonly manbytes: number
	readonly width: number
	readonly height: number
}

export type VariantLayerEntries = VariantEntry[][]
