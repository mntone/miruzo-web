import type { Writable } from '~/@types/utils'
import type { VariantLayerModels, VariantModel } from '~/api/types'
import type { VariantEntry, VariantLayerEntries } from '~/domain'

let baseUrl: string | undefined = undefined
export function getBaseUrl(): string {
	if (baseUrl !== undefined) {
		return baseUrl
	}

	let host = import.meta.env.VITE_STATIC_ASSET_HOST
	if (import.meta.env.DEV) {
		host = host.replace('{host}', window.location.hostname)
	}
	baseUrl = host === '' ? '' : '//' + host
	return baseUrl
}

export function resetBaseUrlForTests(): void {
	baseUrl = undefined
}

export function initVariantEntry(variant: VariantModel): VariantEntry {
	const newEntry: Writable<VariantEntry> = {
		src: getBaseUrl() + variant.src,
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
