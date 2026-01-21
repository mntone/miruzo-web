import type { ImageListRequest } from '../types'

import { DEFAULT_IMAGE_LIST_LIMIT, IMAGE_LIST_LIMIT_MAX, IMAGE_LIST_LIMIT_MIN } from './limit'

function clampLimit(limit: number): number {
	if (limit < IMAGE_LIST_LIMIT_MIN) {
		if (import.meta.env.DEV) {
			throw Error(`limit must be >= ${IMAGE_LIST_LIMIT_MIN}`)
		}
		limit = IMAGE_LIST_LIMIT_MIN
	} else if (limit > IMAGE_LIST_LIMIT_MAX) {
		if (import.meta.env.DEV) {
			throw Error(`limit must be <= ${IMAGE_LIST_LIMIT_MAX}`)
		}
		limit = IMAGE_LIST_LIMIT_MAX
	}
	return limit
}

export function buildImageListParams(
	request: Omit<ImageListRequest, 'type'>,
): URLSearchParams | undefined {
	const hasCursor = request.cursor !== undefined && request.cursor.length !== 0
	const hasExcludeFormats = request.excludeFormats !== undefined && request.excludeFormats.length !== 0
	const shouldIncludeLimit = request.limit !== DEFAULT_IMAGE_LIST_LIMIT
	const hasParams = hasCursor || hasExcludeFormats || shouldIncludeLimit
	if (!hasParams) {
		return undefined
	}

	const query = new URLSearchParams()
	if (hasCursor) {
		query.set('cursor', request.cursor)
	}
	if (hasExcludeFormats) {
		query.set('exclude_formats', request.excludeFormats.join('+'))
	}
	if (shouldIncludeLimit) {
		query.set('limit', `${clampLimit(request.limit)}`)
	}
	return query
}
