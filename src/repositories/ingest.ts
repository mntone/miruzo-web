import type { Writable } from '~/@types/utils'
import { fetchImageList } from '~/api/images'
import type { ImageListRequest, ImageListResponse } from '~/api/types'
import type { ImageEntry, IngestId, IngestIdListResponse } from '~/domain'
import { setImageStore } from '~/stores/image'

import { mergeImageEntry } from './image'

export function initIngestIdListResponse(r: ImageListResponse): IngestIdListResponse {
	let ids: IngestId[]
	if (r.items !== undefined) {
		ids = new Array<IngestId>(r.items.length)
		for (let i = 0; i < r.items.length; ++i) {
			ids[i] = r.items[i].id
		}
	} else {
		ids = []
	}

	const newEntry: Writable<IngestIdListResponse> = {
		ids,
	}
	if (r.cursor !== undefined) {
		newEntry.cursor = r.cursor
	}
	return newEntry
}

export function loadIngestIdList(request: ImageListRequest): Promise<IngestIdListResponse> {
	return fetchImageList(request).then(function(response): IngestIdListResponse {
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
