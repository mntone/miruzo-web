/* eslint-disable camelcase */

import type { Writable } from '~/@types/utils'
import type { LoveStatsModel } from '~/api/types/love'
import type { QuotaItem } from '~/api/types/quota'
import { toDate, toDateOptional } from '~/api/utils'
import type { QuotaEntry, StatsEntry } from '~/domain'

import { applyLove, applyLoveQuota } from './interaction'

describe('applyLoveStats', () => {
	it('updates score and love timestamps', () => {
		const stats: Writable<StatsEntry> = {
			score: 1,
			viewCount: 52,
			firstLovedAt: new Date('2024-01-01T00:00:00.000Z'),
			lastLovedAt: new Date('2024-01-02T00:00:00.000Z'),
		}

		const model: LoveStatsModel = {
			score: 10,
			first_loved_at: '2024-02-01T00:00:00.000Z',
			last_loved_at: '2024-02-02T00:00:00.000Z',
		}
		applyLove(stats, model)

		expect(stats.score).toBe(10)
		expect(stats.firstLovedAt).toEqual(toDateOptional(model.first_loved_at))
		expect(stats.lastLovedAt).toEqual(toDateOptional(model.last_loved_at))
	})

	it('removes timestamps when the model does not include them', () => {
		const stats: Writable<StatsEntry> = {
			score: 1,
			viewCount: 64,
			firstLovedAt: new Date('2024-01-01T00:00:00.000Z'),
			lastLovedAt: new Date('2024-01-02T00:00:00.000Z'),
		}

		const model: LoveStatsModel = {
			score: 3,
		}
		applyLove(stats, model)

		expect(stats.score).toBe(3)
		expect(stats.firstLovedAt).toBeUndefined()
		expect(stats.lastLovedAt).toBeUndefined()
	})
})

describe('applyLoveQuota', () => {
	it('overwrites quota fields from the API response', () => {
		const entry: Writable<QuotaEntry> = {
			resetAt: null,
			limit: 10,
			remaining: 4,
			used: 6,
		}
		const model: QuotaItem = {
			period: 'daily',
			reset_at: '2026-03-24T00:00:00.000Z',
			limit: 12,
			remaining: 3,
		}

		applyLoveQuota(entry, model)

		expect(entry.resetAt).toEqual(toDate(model.reset_at))
		expect(entry.limit).toBe(model.limit)
		expect(entry.remaining).toBe(model.remaining)
		expect(entry.used).toBe(model.limit - model.remaining)
	})

	it('recomputes used from limit and remaining', () => {
		const entry: Writable<QuotaEntry> = {
			resetAt: null,
			limit: 3,
			remaining: 2,
			used: 999,
		}
		const model: QuotaItem = {
			period: 'daily',
			reset_at: '2026-03-25T00:00:00.000Z',
			limit: 5,
			remaining: 0,
		}

		applyLoveQuota(entry, model)

		expect(entry.remaining).toBe(0)
		expect(entry.used).toBe(5)
	})
})
