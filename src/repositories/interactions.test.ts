/* eslint-disable camelcase */

import type { Writable } from '~/@types/utils'
import type { LoveStatsModel } from '~/api/types/love'
import { toDateOptional } from '~/api/utils'
import type { StatsEntry } from '~/domain'

import { applyLove } from './interactions'

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
