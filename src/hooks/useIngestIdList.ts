import { createEffect, createResource, createSignal, type Accessor, type Resource } from 'solid-js'

import type { Writable } from '~/@types/utils'
import type { ImageListType, IngestId, IngestIdListResponse } from '~/domain'
import { loadIngestIdList, type IngestIdListRequest } from '~/repositories/ingests'

export function useIngestIdList(
	type: ImageListType,
	limit: number,
	excludeFormats: readonly string[] | undefined,
): readonly [Accessor<IngestId[]>, Resource<IngestIdListResponse>, () => void] {
	const [getCursor, setCursor] = createSignal<string>('')
	const [getIngestIds, setIngestIds] = createSignal<IngestId[]>([])

	const [listPage] = createResource(function() {
		const request: Writable<IngestIdListRequest> = {
			type,
			limit,
		}

		const cursor = getCursor()
		if (cursor !== '') {
			request.cursor = cursor
		}
		if (excludeFormats !== undefined) {
			request.excludeFormats = excludeFormats
		}
		return request
	}, loadIngestIdList)

	createEffect(function() {
		const p = listPage()
		if (!p) {
			return
		}

		setIngestIds(function(previous) {
			return [...previous, ...p.ids]
		})
	})

	function loadMore() {
		const p = listPage()
		if (!p || !p.cursor) {
			return
		}

		setCursor(p.cursor)
	}

	return [getIngestIds, listPage, loadMore] as const
}
