import type { Writable } from '~/@types/utils'
import { buildImageListParams, fetchImageList, IMAGE_LIST_LIMIT_MAX, IMAGE_LIST_LIMIT_MIN } from '~/api/images'
import type { ImageListResponse } from '~/api/types'
import type { ImageEntry, ImageListType, IngestId, IngestIdListResponse } from '~/domain'
import { setImageStore } from '~/stores/images'

import { mergeImageEntry } from './image'

export interface IngestIdListRequest {
	readonly type: ImageListType
	readonly limit: number
	readonly cursor?: string
	readonly excludeFormats?: readonly string[]
}

export function initIngestIdListResponse(r: ImageListResponse): IngestIdListResponse {
	const newEntry: Writable<IngestIdListResponse> = {
		ids: r.items?.map(function(item) {
			return item.id
		}) ?? [],
	}
	if (r.cursor !== undefined) {
		newEntry.cursor = r.cursor
	}
	return newEntry
}
export function loadIngestIdList(request: IngestIdListRequest): Promise<IngestIdListResponse> {
	let limit: number
	if (request.limit < IMAGE_LIST_LIMIT_MIN) {
		if (import.meta.env.DEV) {
			throw Error(`limit must be >= ${IMAGE_LIST_LIMIT_MIN}`)
		} else {
			limit = IMAGE_LIST_LIMIT_MIN
		}
	} else if (request.limit > IMAGE_LIST_LIMIT_MAX) {
		if (import.meta.env.DEV) {
			throw Error(`limit must be <= ${IMAGE_LIST_LIMIT_MAX}`)
		} else {
			limit = IMAGE_LIST_LIMIT_MAX
		}
	} else {
		limit = request.limit
	}

	const query = buildImageListParams(
		limit,
		request.cursor,
		request.excludeFormats,
	)
	return fetchImageList(request.type, query).then(function(response): IngestIdListResponse {
		setImageStore('imagesById', function(prev): Record<IngestId, ImageEntry> {
			const next = Object.assign({}, prev)
			if (response.items !== undefined) {
				for (const item of response.items) {
					next[item.id] = mergeImageEntry(prev[item.id], item)
				}
			}
			return next
		})
		return initIngestIdListResponse(response)
	})
}
