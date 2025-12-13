import type { Writable } from '~/@types/utils'
import type { ImageList, ImageListResource, Variant } from '~/domain/images'

import type { ImageListModel, VariantModel, ImageListResponse as ImageListResponse } from '../../types'

import { mapImageStatus } from './shared'

function addBaseUrl(src: string): string {
	const baseUrl = import.meta.env.DEV
		? import.meta.env.VITE_STATIC_ASSETS.replace('{host}', window.location.hostname)
		: import.meta.env.VITE_STATIC_ASSETS
	const url = baseUrl + src
	return url
}

export function mapImageVariant(r: VariantModel): Variant {
	const ret: Writable<Variant> = {
		src: addBaseUrl(r.src),
		format: r.format,
		manbytes: r.manbytes,
		width: r.w,
		height: r.h,
	}
	if (r.codecs !== undefined) {
		ret.codecs = r.codecs
	}
	return ret
}

export function mapImageList(r: ImageListModel): ImageList {
	const ret: Writable<ImageList> = {
		id: r.id,
		status: mapImageStatus(r.status),

		original: mapImageVariant(r.original),
		variants: r.variants.map(function(variant) {
			return variant.map(mapImageVariant)
		}),
	}
	if (r.fallback !== undefined) {
		ret.fallback = mapImageVariant(r.fallback)
	}
	return ret
}

export function mapImageListResource(r: ImageListResponse): ImageListResource {
	return r.cursor !== undefined
		? { cursor: r.cursor, items: r.items.map(mapImageList) }
		: { items: r.items.map(mapImageList) }
}
