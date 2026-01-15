/* eslint-disable camelcase */

import type { Writable } from '~/@types/utils'
import type { LoveStatsModel } from '~/api/types/love'
import { toDateOptional } from '~/api/utils'
import type { QuotaEntry, StatsEntry } from '~/domain'

import { applyLove, consumeLoveQuota } from './interactions'

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

describe('consumeLoveQuota', () => {
	it('decrements remaining and increments used', () => {
		const entry: Writable<QuotaEntry> = {
			resetAt: null,
			limit: 3,
			remaining: 2,
			used: 1,
		}

		consumeLoveQuota(entry)

		expect(entry.remaining).toBe(1)
		expect(entry.used).toBe(2)
	})

	it('clamps remaining at zero', () => {
		const entry: Writable<QuotaEntry> = {
			resetAt: null,
			limit: 1,
			remaining: 0,
			used: 1,
		}

		consumeLoveQuota(entry)

		expect(entry.remaining).toBe(0)
		expect(entry.used).toBe(2)
	})
})
