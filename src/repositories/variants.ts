import type { Writable } from '~/@types/utils'
import type { VariantLayerModels, VariantModel } from '~/api/types'
import type { VariantEntry, VariantLayerEntries } from '~/domain'

let baseUrl: string | undefined = undefined
export function getBaseUrl(): string {
	if (baseUrl !== undefined) {
		return baseUrl
	}

	const host = import.meta.env.DEV
		? import.meta.env.VITE_STATIC_ASSET_HOST.replace('{host}', window.location.hostname)
		: import.meta.env.VITE_STATIC_ASSET_HOST
	if (host === '') {
		baseUrl = ''
		return ''
	}

	const protocol = import.meta.env.DEV
		? import.meta.env.VITE_STATIC_ASSET_PROTOCOL.replace('{protocol}', window.location.protocol)
		: import.meta.env.VITE_STATIC_ASSET_PROTOCOL
	const urlPrefix = protocol + '//' + host
	baseUrl = urlPrefix
	return urlPrefix
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
