import { apiClient } from './client'
import type { QuotaResponse } from './types/quota'

export function fetchQuota(): Promise<QuotaResponse> {
	return apiClient<QuotaResponse>('GET', '/quota')
}
