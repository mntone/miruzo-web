import { createEffect, createResource, createSignal, type Accessor } from 'solid-js'

import { fetchImageById, mapImageContext } from '~/api/images'
import type { ImageContext } from '~/domain/images/context'

export function useImageContext(getImageId: Accessor<number>) {
	const [getImage, setImage] = createSignal<ImageContext | undefined>(undefined)

	const [detailPage] = createResource(getImageId, function(params) {
		const task = fetchImageById(params).then(mapImageContext)
		return task
	})

	createEffect(function() {
		const p = detailPage()
		if (!p) {
			return
		}

		setImage(function() {
			return p
		})
	})

	return [getImage, detailPage]
}
