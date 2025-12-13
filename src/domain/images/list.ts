import type { ImageStatus } from './shared'

export interface Variant {
	readonly src: string
	readonly format: string
	readonly codecs?: string
	readonly manbytes: number
	readonly width: number
	readonly height: number
}

export type Variants = readonly (readonly Variant[])[]

export interface ImageList {
	readonly id: number
	readonly status: ImageStatus
	readonly original: Variant
	readonly fallback?: Variant
	readonly variants: Variants
}

export interface ImageListResource {
	readonly items: readonly ImageList[]
	readonly cursor?: string
}
