import { createEffect, createResource, createSignal, type Accessor, type Resource } from 'solid-js'

import { buildImageListParams } from '~/api/images/params'
import type { IngestId, IngestIdListResponse } from '~/domain'
import { loadIngestIdList } from '~/repositories/ingests'

export function useIngestIdList(
	limit: number = 50,
	excludeFormats: readonly string[] | undefined,
): [Accessor<IngestId[]>, Resource<IngestIdListResponse>, () => void] {
	const [getCursor, setCursor] = createSignal<string>('')
	const [getIngestIds, setIngestIds] = createSignal<IngestId[]>([])

	const [listPage] = createResource(getCursor, function(cursor) {
		const query = buildImageListParams(limit, cursor, excludeFormats)
		const task = loadIngestIdList(query)
		return task
	})

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

	return [getIngestIds, listPage, loadMore]
}
