import type { Writable } from '~/@types/utils'
import { fetchImageList } from '~/api/images'
import { buildImageListParams } from '~/api/images/params'
import type { ImageListResponse, ImageListType } from '~/api/types'
import type { ImageEntry, IngestId, IngestIdListResponse } from '~/domain'
import { setImageStore } from '~/stores/images'

import { mergeImageEntry } from './images'

export interface IngestIdListRequest {
	readonly type: ImageListType
	readonly limit: number
	readonly cursor?: string
	readonly excludeFormats?: readonly string[]
}

export function initIngestIdListResponse(r: ImageListResponse): IngestIdListResponse {
	const newEntry: Writable<IngestIdListResponse> = {
		ids: r.items.map(function(item) {
			return item.id
		}),
	}
	if (r.cursor !== undefined) {
		newEntry.cursor = r.cursor
	}
	return newEntry
}
export function loadIngestIdList(request: IngestIdListRequest): Promise<IngestIdListResponse> {
	const query = buildImageListParams(
		request.limit,
		request.cursor,
		request.excludeFormats,
	)
	return fetchImageList(request.type, query).then(function(response): IngestIdListResponse {
		setImageStore('imagesById', function(prev): Record<IngestId, ImageEntry> {
			const next = Object.assign({}, prev)
			for (const item of response.items) {
				next[item.id] = mergeImageEntry(prev[item.id], item)
			}
			return next
		})
		return initIngestIdListResponse(response)
	})
}
