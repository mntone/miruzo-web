import type { Writable } from '~/@types/utils'
import type { ImageListRequest } from '~/api/types'
import type { ImageEntry, ImageEntrySlice, IngestIdListResponse } from '~/domain'
import { imageStore } from '~/stores/image'

import { loadIngestIdList } from './ingest'

export function createImageEntrySlice(r: IngestIdListResponse): ImageEntrySlice {
	const entries = new Array<ImageEntry>(r.ids.length)
	for (let i = 0; i < r.ids.length; ++i) {
		const id = r.ids[i]
		const entry = imageStore.imagesById[id]
		if (entry === undefined) {
			throw Error(`Image entry ${id} is missing in the store`)
		}
		entries[i] = entry
	}

	const slice: Writable<ImageEntrySlice> = { entries }
	if (r.cursor !== undefined) {
		slice.cursor = r.cursor
	}
	return slice
}

export function loadImageEntryList(request: ImageListRequest): Promise<ImageEntrySlice> {
	return loadIngestIdList(request).then(createImageEntrySlice)
}
