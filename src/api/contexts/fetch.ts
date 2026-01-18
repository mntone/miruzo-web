import { apiClient } from '../client'
import type { ContextLevel, ContextRequest, ContextResponse, ImageRichModel } from '../types'

type ContextResponseByLevel<Level extends ContextLevel | undefined>
	= Level extends 'rich'
		? ContextResponse<ImageRichModel>
		: ContextResponse

export function fetchContextById<Level extends ContextLevel | undefined>(
	request: ContextRequest & { level?: Level },
): Promise<ContextResponseByLevel<Level>> {
	const url = request.level === 'rich'
		? `/i/${request.ingestId}?level=rich`
		: `/i/${request.ingestId}`
	return apiClient<ContextResponseByLevel<Level>>('GET', url)
}
