import { deriveEventsFromStats, tryDeriveEventsFromStats } from './events'
import type { StatsEntry } from './stats'

function createStats(overrides: Partial<StatsEntry>): StatsEntry {
	return {
		score: 0,
		viewCount: 0,
		...overrides,
	}
}

describe('deriveEventsFromStats', () => {
	it('keeps only love:first when first and last love timestamps match', () => {
		const first = new Date(Date.UTC(2024, 0, 1, 12, 0, 0))
		const stats = createStats({
			firstLovedAt: first,
			lastLovedAt: new Date(first.getTime()),
		})

		const entries = deriveEventsFromStats(stats)
		expect(entries).toHaveLength(1)
		expect(entries[0].type).toBe('love:first')
		expect(entries[0].occurredAt.getTime()).toBe(first.getTime())
	})

	it('emits love:first and love when timestamps differ', () => {
		const first = new Date(Date.UTC(2024, 0, 1, 12, 0, 0))
		const last = new Date(Date.UTC(2024, 0, 2, 12, 0, 0))
		const stats = createStats({
			firstLovedAt: first,
			lastLovedAt: last,
		})

		const entries = deriveEventsFromStats(stats)
		expect(entries).toHaveLength(2)
		expect(entries[0].type).toBe('love')
		expect(entries[0].occurredAt.getTime()).toBe(last.getTime())
		expect(entries[1].type).toBe('love:first')
		expect(entries[1].occurredAt.getTime()).toBe(first.getTime())
	})

	it('adds view milestones and sorts by newest event', () => {
		const first = new Date(Date.UTC(2024, 0, 1, 12, 0, 0))
		const last = new Date(Date.UTC(2024, 0, 2, 12, 0, 0))
		const milestone = new Date(Date.UTC(2024, 0, 3, 12, 0, 0))
		const stats = createStats({
			firstLovedAt: first,
			lastLovedAt: last,
			viewMilestoneCount: 1200,
			viewMilestoneArchivedAt: milestone,
		})

		const entries = deriveEventsFromStats(stats)
		expect(entries).toHaveLength(3)
		expect(entries.map(entry => entry.type)).toEqual([
			'view:milestone',
			'love',
			'love:first',
		])
		expect(entries[0].occurredAt.getTime()).toBe(milestone.getTime())
		if (entries[0].type === 'view:milestone') {
			expect(entries[0].viewCount).toBe(1200)
		}
	})

	it('returns an empty list when no event fields are present', () => {
		const stats = createStats({})
		const entries = deriveEventsFromStats(stats)
		expect(entries).toHaveLength(0)
	})

	it('keeps milestone entries when view count is zero', () => {
		const milestone = new Date(Date.UTC(2024, 0, 3, 12, 0, 0))
		const stats = createStats({
			viewMilestoneCount: 0,
			viewMilestoneArchivedAt: milestone,
		})

		const entries = deriveEventsFromStats(stats)
		expect(entries).toHaveLength(1)
		expect(entries[0].type).toBe('view:milestone')
		expect(entries[0].occurredAt.getTime()).toBe(milestone.getTime())
		if (entries[0].type === 'view:milestone') {
			expect(entries[0].viewCount).toBe(0)
		}
	})
})

describe('tryDeriveEventsFromStats', () => {
	it('returns an error when love timestamps are incomplete', () => {
		const stats = createStats({
			firstLovedAt: new Date(Date.UTC(2024, 0, 1, 12, 0, 0)),
		})

		const result = tryDeriveEventsFromStats(stats)
		expect(result.status).toBe('failure')
		if (result.status === 'failure') {
			expect(result.error).toBe('love-mismatch')
		}
	})

	it('returns an error when milestone data is incomplete', () => {
		const stats = createStats({
			viewMilestoneCount: 100,
		})

		const result = tryDeriveEventsFromStats(stats)
		expect(result.status).toBe('failure')
		if (result.status === 'failure') {
			expect(result.error).toBe('milestone-mismatch')
		}
	})

	it('returns events when no event fields are present', () => {
		const stats = createStats({})
		const result = tryDeriveEventsFromStats(stats)
		expect(result.status).toBe('success')
		if (result.status === 'success') {
			expect(result.value).toHaveLength(0)
		}
	})
})
