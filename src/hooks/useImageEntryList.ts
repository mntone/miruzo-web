import { batch, createSignal, type Accessor } from 'solid-js'

import type { Writable } from '~/@types/utils'
import type { ImageListRequest } from '~/api/types'
import type { ImageEntry, ImageEntrySlice, ImageListType } from '~/domain'
import { loadImageEntryList } from '~/repositories'
import { normalizeError } from '~/utils/error'
import { getExcludeFormats } from '~/utils/imageSupport'

export interface ImageEntryListOptions {
	readonly type: ImageListType
	readonly limit: number
}

interface ImageEntryListController {
	images: Accessor<readonly ImageEntry[]>
	isPending: Accessor<boolean>
	error: Accessor<Error | undefined>

	hasNext: Accessor<boolean>
	loadNext(this: void): void
}

function createImageListRequest(
	options: ImageEntryListOptions,
	tail: string,
): ImageListRequest {
	const request: Writable<ImageListRequest> = {
		type: options.type,
		limit: options.limit,
		cursor: tail,
	}

	const excludeFormats = getExcludeFormats()
	if (excludeFormats !== undefined) {
		request.excludeFormats = excludeFormats
	}

	return request
}

export function useImageEntryList(
	initial: ImageEntrySlice,
	options: ImageEntryListOptions,
): ImageEntryListController {
	const [isPending, setIsPending] = createSignal(false)
	const [error, setError] = createSignal<Error | undefined>(undefined)
	const [tail, setTail] = createSignal<string | undefined>(initial.cursor)
	const [images, setImages] = createSignal<readonly ImageEntry[]>(initial.entries)

	function _processResponse(response: ImageEntrySlice | undefined): void {
		batch(function() {
			if (response !== undefined) {
				setImages(function(prev) {
					return [...prev, ...response.entries]
				})
				setTail(response.cursor)
			} else {
				setTail(undefined)
			}
			setIsPending(false)
		})
	}

	function _handleError(err: unknown): void {
		batch(function() {
			setError(normalizeError(err))
			setIsPending(false)
		})
	}

	function loadNext() {
		if (isPending()) {
			return
		}

		const cursor = tail()
		if (cursor === undefined) {
			return
		}

		batch(function() {
			setIsPending(true)
			setError(undefined)
		})

		const request = createImageListRequest(options, cursor)
		void loadImageEntryList(request).then(_processResponse, _handleError)
	}

	function hasNext() {
		return tail() !== undefined
	}

	return {
		images,
		isPending,
		error,

		hasNext,
		loadNext,
	}
}
