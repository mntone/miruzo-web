import type { Writable } from '~/@types/utils'
import type { ImageListModel } from '~/api/types'
import type { ImageEntry } from '~/domain'

import { initVariantLayerResources, initVariantEntry } from './variant'

export function initImageEntry(src: ImageListModel): ImageEntry {
	const newEntry: Writable<ImageEntry> = {
		id: src.id,
		original: initVariantEntry(src.original),
		variants: initVariantLayerResources(src.variants),
	}
	if (src.fallback !== undefined) {
		newEntry.fallback = initVariantEntry(src.fallback)
	}
	return newEntry
}

export function mergeImageEntry(
	dst: ImageEntry | undefined,
	src: ImageListModel,
): ImageEntry {
	if (dst === undefined) {
		return initImageEntry(src)
	}

	const entry: Writable<ImageEntry> = {
		id: dst.id,
		original: initVariantEntry(src.original),
		variants: initVariantLayerResources(src.variants),
	}
	if (dst.ingestedAt !== undefined) {
		entry.ingestedAt = dst.ingestedAt
	}
	if (src.fallback !== undefined) {
		entry.fallback = initVariantEntry(src.fallback)
	}
	if (dst.stats !== undefined) {
		entry.stats = dst.stats
	}
	return entry
}
