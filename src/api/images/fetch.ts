import { apiClient } from '../client'
import type { ContextResponse, ImageListResponse } from '../types'

function buildImageListUrl(query: URLSearchParams | undefined): string {
	if (query !== undefined && query.size !== 0) {
		const search = query.toString()
		return '/i/latest?' + search
	} else {
		return '/i/latest'
	}
}

export function fetchImageList(query?: URLSearchParams): Promise<ImageListResponse> {
	const url = buildImageListUrl(query)
	return apiClient<ImageListResponse>('GET', url)
}

export function fetchContextById(ingestId: number): Promise<ContextResponse> {
	return apiClient<ContextResponse>('GET', `/i/${ingestId}`)
}
