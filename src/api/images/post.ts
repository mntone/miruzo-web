import { apiClient } from '../client'
import type { HallOfFameResponse } from '../types/hallOfFame'
import type { LoveResponse } from '../types/love'

export function postLove(ingestId: number): Promise<LoveResponse> {
	return apiClient<LoveResponse>('POST', `/i/${ingestId}/love`)
}

export function postGrantHallOfFame(ingestId: number): Promise<HallOfFameResponse> {
	return apiClient<HallOfFameResponse>('POST', `/i/${ingestId}/hall_of_fame`)
}
