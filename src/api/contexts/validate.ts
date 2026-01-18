import type { ContextResponse, ImageRichModel } from '../types'

export function isRichContextResponse(
	value: ContextResponse,
): value is ContextResponse<ImageRichModel> {
	return value.image.level === 'rich'
}

export function assertRichContextResponse(
	value: ContextResponse,
): asserts value is ContextResponse<ImageRichModel> {
	if (!isRichContextResponse(value)) {
		throw Error('Context response level must be rich')
	}
}
