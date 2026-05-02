/* eslint-disable camelcase */

import type { Writable } from '~/@types/utils'
import type { HallOfFameStatsModel } from '~/api/types/hallOfFame'
import { toDateOptional } from '~/api/utils'
import type { StatsEntry } from '~/domain'

import { applyHallOfFame } from './hallOfFameReaction'

describe('applyHallOfFame', () => {
	it('updates hallOfFameAt when the model includes hall_of_fame_at', () => {
		const stats: Writable<StatsEntry> = {
			score: 1,
			viewCount: 52,
		}

		const model: HallOfFameStatsModel = {
			hall_of_fame_at: '2026-04-29T00:00:00.000Z',
		}
		applyHallOfFame(stats, model)

		expect(stats.hallOfFameAt).toEqual(toDateOptional(model.hall_of_fame_at))
	})

	it('removes hallOfFameAt when the model does not include hall_of_fame_at', () => {
		const stats: Writable<StatsEntry> = {
			score: 1,
			viewCount: 64,
			hallOfFameAt: new Date('2026-04-29T00:00:00.000Z'),
		}

		const model: HallOfFameStatsModel = {}
		applyHallOfFame(stats, model)

		expect(stats.hallOfFameAt).toBeUndefined()
	})
})
