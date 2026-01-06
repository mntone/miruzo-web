import { createEffect, createResource, createSignal, type Accessor, type Resource } from 'solid-js'

import { fetchImageList, mapImageListResource } from '~/api/images'
import { buildImageListParams } from '~/api/images/params'
import type { ImageList, ImageListResource } from '~/domain/images/list'

export function useImageList(
	limit: number = 50,
	excludeFormats: readonly string[] | undefined,
): [Accessor<ImageList[]>, Resource<ImageListResource>, () => void] {
	const [getCursor, setCursor] = createSignal<string>('')
	const [getImages, setImages] = createSignal<ImageList[]>([])

	const [listPage] = createResource(getCursor, function(cursor) {
		const query = buildImageListParams(limit, cursor, excludeFormats)
		const task = fetchImageList(query).then(mapImageListResource)
		return task
	})

	createEffect(function() {
		const p = listPage()
		if (!p) {
			return
		}

		setImages(function(previous) {
			return [...previous, ...p.items]
		})
	})

	function loadMore() {
		const p = listPage()
		if (!p || !p.cursor) {
			return
		}

		setCursor(p.cursor)
	}

	return [getImages, listPage, loadMore]
}
