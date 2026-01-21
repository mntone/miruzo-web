import type { ImageEntry } from '~/domain'

import { buildOriginalVariantEntry, buildVariantLayerEntries } from './variant'

export function buildImageEntry(id: number, name: string): ImageEntry {
	return {
		id,
		original: buildOriginalVariantEntry(name),
		variants: buildVariantLayerEntries(name),
	}
}
