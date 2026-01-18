import { DEFAULT_IMAGE_LIST_LIMIT } from './limit'

export function buildImageListParams(
	limit: number,
	cursor?: string,
	excludeFormats?: readonly string[],
): URLSearchParams | undefined {
	const hasCursor = cursor !== undefined && cursor.length !== 0
	const hasExcludeFormats = excludeFormats !== undefined && excludeFormats.length !== 0
	const shouldIncludeLimit = limit && limit !== DEFAULT_IMAGE_LIST_LIMIT
	const hasParams = hasCursor || hasExcludeFormats || shouldIncludeLimit
	if (!hasParams) {
		return undefined
	}

	const query = new URLSearchParams()
	if (hasCursor) {
		query.set('cursor', cursor)
	}
	if (hasExcludeFormats) {
		query.set('exclude_formats', excludeFormats.join('+'))
	}
	if (shouldIncludeLimit) {
		query.set('limit', limit.toString())
	}
	return query
}
