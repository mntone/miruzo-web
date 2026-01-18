/* eslint-disable camelcase */

import type { QuotaItem } from '~/api/types/quota'

import { initQuotaEntry } from './quota'

describe('initQuotaEntry', () => {
	it('maps fields and computes used', () => {
		const response: QuotaItem = {
			period: 'daily',
			reset_at: '2026-01-14T05:00:00.000Z',
			limit: 3,
			remaining: 2,
		}

		const mapped = initQuotaEntry(response)
		expect(mapped.resetAt).toEqual(new Date(response.reset_at))
		expect(mapped.limit).toBe(3)
		expect(mapped.remaining).toBe(2)
		expect(mapped.used).toBe(1)
	})
})
