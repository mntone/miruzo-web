import { apiClient } from '../client'
import type { ImageListRequest, ImageListResponse } from '../types'

import { buildImageListParams } from './query'

export function fetchImageList(request: ImageListRequest): Promise<ImageListResponse> {
	const query = buildImageListParams(request)
	const url = query !== undefined
		? '/i/' + request.type + '?' + query.toString()
		: '/i/' + request.type
	return apiClient<ImageListResponse>('GET', url)
}
