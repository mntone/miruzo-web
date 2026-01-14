import type { EventEntries } from './events'
import type { IngestId } from './ingests'
import type { StatsEntry } from './stats'
import type { VariantEntry, VariantLayerEntries } from './variants'

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

export function assertHasStats(entry: ImageEntry | undefined): asserts entry is ImageEntryWithStats {
	if (entry?.stats === undefined) {
		throw new Error('ImageEntry and stats must exist')
	}
}

export function hasStats(entry: ImageEntry | undefined): entry is ImageEntryWithStats {
	return entry?.stats !== undefined
}
