import { apiClient } from '../client'
import type { ImageContextResponse, ImageListResponse } from '../types'

export function fetchImageList(query?: URLSearchParams): Promise<ImageListResponse> {
	const search = query?.toString()
	const url = search && search.length > 0
		? `/i/latest?${search}`
		: '/i/latest'
	return apiClient<ImageListResponse>('GET', url)
}

export function fetchImageById(imageId: number): Promise<ImageContextResponse> {
	return apiClient<ImageContextResponse>('GET', `/i/${imageId}`)
}
