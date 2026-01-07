import type { Writable } from '~/@types/utils'
import { fetchImageList } from '~/api/images'
import type { ImageListResponse } from '~/api/types'
import type { ImageEntry, IngestId, IngestIdListResponse } from '~/domain'
import { setImageStore } from '~/stores/images'

import { mergeImageEntry } from './images'

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

export function loadIngestIdList(query?: URLSearchParams): Promise<IngestIdListResponse> {
	return fetchImageList(query).then(function(response): IngestIdListResponse {
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
