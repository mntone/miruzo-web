import { createMemo, type Accessor, type Resource } from 'solid-js'

import type { ImageEntry, IngestIdListResponse } from '~/domain'
import { imageStore } from '~/stores/image'

import type { IngestIdListParams } from './types'
import { useIngestIdList } from './useIngestIdList'

export function useImageEntries(
	params: IngestIdListParams,
	excludeFormats: readonly string[] | undefined,
): readonly [
	Accessor<readonly ImageEntry[]>,
	Resource<IngestIdListResponse>,
	() => void,
] {
	const [getIngestIds, listPage, loadMore] = useIngestIdList(params, excludeFormats)

	const getEntries = createMemo(function() {
		const ids = getIngestIds()
		const entries = new Array<ImageEntry>(ids.length)
		for (let i = 0; i < ids.length; ++i) {
			const id = ids[i]
			const entry = imageStore.imagesById[id]
			if (entry === undefined) {
				throw Error(`Image entry ${id} is missing in the store`)
			}
			entries[i] = entry
		}
		return entries
	})

	return [getEntries, listPage, loadMore] as const
}
