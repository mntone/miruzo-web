import type { Writable } from '~/@types/utils'
import type { VariantLayerModels, VariantModel } from '~/api/types'
import type { VariantEntry, VariantLayerEntries } from '~/domain'

function addBaseUrl(src: string): string {
	const baseUrl = import.meta.env.DEV
		? import.meta.env.VITE_STATIC_ASSETS.replace('{host}', window.location.hostname)
		: import.meta.env.VITE_STATIC_ASSETS
	const url = baseUrl + src
	return url
}

export function initVariantEntry(variant: VariantModel): VariantEntry {
	const newEntry: Writable<VariantEntry> = {
		src: addBaseUrl(variant.src),
		format: variant.format,
		manbytes: variant.manbytes,
		width: variant.w,
		height: variant.h,
	}
	if (variant.codecs !== undefined) {
		newEntry.codecs = variant.codecs
	}
	return newEntry
}

export function initVariantLayerResources(layers: VariantLayerModels): VariantLayerEntries {
	return layers.map(function(layer) {
		return layer.map(function(variant) {
			return initVariantEntry(variant)
		})
	})
}
