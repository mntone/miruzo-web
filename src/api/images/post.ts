import { apiClient } from '../client'
import type { LoveResponse } from '../types/love'

export function postLove(ingestId: number): Promise<LoveResponse> {
	return apiClient<LoveResponse>('POST', `/i/${ingestId}/love`)
}
