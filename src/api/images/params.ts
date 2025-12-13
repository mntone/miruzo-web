import { DEFAULT_IMAGE_LIST_LIMIT } from '../constants'

export function buildImageListParams(
	limit: number,
	cursor?: string,
	excludeFormats?: readonly string[],
): URLSearchParams {
	const query = new URLSearchParams()
	if (cursor) {
		query.set('cursor', cursor)
	}
	if (excludeFormats) {
		query.set('exclude_formats', excludeFormats.join('+'))
	}
	if (limit && limit !== DEFAULT_IMAGE_LIST_LIMIT) {
		query.set('limit', limit.toString())
	}
	return query
}
