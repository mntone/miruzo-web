import type { Writable } from '~/@types/utils'
import { fetchQuota } from '~/api/quota'
import type { QuotaItem, QuotaResponse } from '~/api/types/quota'
import { toDate } from '~/api/utils'
import type { QuotaEntries, QuotaEntry } from '~/domain'
import { setQuotaStore } from '~/stores/quota'

export function initQuotaEntry(quota: QuotaItem): QuotaEntry {
	const newEntry: QuotaEntry = {
		resetAt: toDate(quota.reset_at),
		limit: quota.limit,
		remaining: quota.remaining,
		used: quota.limit - quota.remaining,
	}
	return newEntry
}

export function applyQuota(
	dst: Writable<QuotaEntries>,
	src: QuotaResponse,
): void {
	dst.love = initQuotaEntry(src.love)
}

export function loadQuotaIntoStore(): Promise<void> {
	return fetchQuota().then(function(response): void {
		setQuotaStore(function(prev: QuotaEntries): QuotaEntries {
			const next = Object.assign({}, prev)
			applyQuota(next, response)
			return next
		})
	})
}
