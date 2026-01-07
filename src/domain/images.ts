import type { IngestId } from './ingests'
import type { StatsEntry } from './stats'
import type { VariantEntry, VariantLayerEntries } from './variants'

export interface ImageEntry {
	readonly id: IngestId
	readonly ingestedAt?: Date
	readonly original: VariantEntry
	readonly fallback?: VariantEntry
	readonly variants: VariantLayerEntries

	readonly stats?: StatsEntry
}
