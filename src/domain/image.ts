import type { EventEntries } from './event'
import type { IngestId } from './ingest'
import type { StatsEntry } from './stats'
import type { VariantEntry, VariantLayerEntries } from './variant'

export interface ImageEntry {
	readonly id: IngestId
	readonly ingestedAt?: Date
	readonly original: VariantEntry
	readonly fallback?: VariantEntry
	readonly variants: VariantLayerEntries

	readonly events?: EventEntries
	readonly stats?: StatsEntry
}

export type ImageEntryWithStats = ImageEntry & { readonly stats: StatsEntry }

const IMAGE_LIST_TYPES = [
	'latest',
	'chronological',
	'recently',
	'first_love',
	'hall_of_fame',
	'engaged',
] as const

export type ImageListType = typeof IMAGE_LIST_TYPES[number]

const imageListTypeSet: ReadonlySet<string> = new Set(IMAGE_LIST_TYPES)

export function isImageListType(value: string): value is ImageListType {
	return imageListTypeSet.has(value)
}

export function assertHasStats(entry: ImageEntry | undefined): asserts entry is ImageEntryWithStats {
	if (entry?.stats === undefined) {
		throw new Error('ImageEntry and stats must exist')
	}
}

export function hasStats(entry: ImageEntry | undefined): entry is ImageEntryWithStats {
	return entry?.stats !== undefined
}
