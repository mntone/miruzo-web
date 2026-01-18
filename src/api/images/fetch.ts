import type { ImageListType } from '~/domain'

import { apiClient } from '../client'
import type { ImageListResponse } from '../types'

function buildImageListUrl(type: ImageListType, query: URLSearchParams | undefined): string {
	if (query !== undefined && query.size !== 0) {
		const search = query.toString()
		return '/i/' + type + '?' + search
	} else {
		return '/i/' + type
	}
}

export function fetchImageList(type: ImageListType, query?: URLSearchParams): Promise<ImageListResponse> {
	const url = buildImageListUrl(type, query)
	return apiClient<ImageListResponse>('GET', url)
}
