import { canGrantHallOfFame, HALL_OF_FAME_SCORE_THRESHOLD } from './stats'
import type { StatsEntry } from './stats'

function createStats(overrides: Partial<StatsEntry>): StatsEntry {
	return {
		score: 0,
		viewCount: 0,
		...overrides,
	}
}

describe('canGrantHallOfFame', () => {
	it('returns true when the score reaches threshold and hall of fame is not granted yet', () => {
		const stats = createStats({
			score: HALL_OF_FAME_SCORE_THRESHOLD,
		})

		expect(canGrantHallOfFame(stats)).toBe(true)
	})

	it('returns false when the score is below threshold', () => {
		const stats = createStats({
			score: HALL_OF_FAME_SCORE_THRESHOLD - 1,
		})

		expect(canGrantHallOfFame(stats)).toBe(false)
	})

	it('returns false when hall of fame is already granted', () => {
		const stats = createStats({
			score: HALL_OF_FAME_SCORE_THRESHOLD + 100,
			hallOfFameAt: new Date('2026-05-01T00:00:00.000Z'),
		})

		expect(canGrantHallOfFame(stats)).toBe(false)
	})
})
