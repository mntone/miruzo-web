/* eslint-disable camelcase */
import type { ImageContextResponse, ImageStatsModel, ImageSummaryModel } from '../../types'

import { mapImageContext, mapImageStats, mapImageSummary } from './context'

describe('mapImageSummary', () => {
	it('maps response payloads into the internal model', () => {
		const capturedAt = '2024-01-02T03:04:05.000Z'
		const ingestedAt = '2024-01-10T11:12:13.000Z'

		const response: ImageSummaryModel = {
			id: 1,
			status: 1,
			captured_at: capturedAt,
			ingested_at: ingestedAt,
		}

		const mapped = mapImageSummary(response)

		expect(mapped.id).toBe(1)
		expect(mapped.status).toBe('deleted')
		expect(mapped.capturedAt).toEqual(new Date(capturedAt))
		expect(mapped.ingestedAt).toEqual(new Date(ingestedAt))
	})

	it('defaults status to active when omitted', () => {
		const response: ImageSummaryModel = {
			id: 2,
			ingested_at: '2024-01-10T11:12:13.000Z',
		}

		const mapped = mapImageSummary(response)
		expect(mapped.status).toBe('active')
	})
})

describe('mapImageStats', () => {
	it('maps stats flags and aggregates to camelCase fields', () => {
		const lastViewedAt = '2024-02-01T00:00:00.000Z'

		const response: ImageStatsModel = {
			is_favorited: true,
			score: 200,
			view_count: 24,
			last_viewed_at: lastViewedAt,
		}

		const mapped = mapImageStats(response)

		expect(mapped).toMatchObject({
			isFavorited: true,
			score: 200,
			viewCount: 24,
		})
		expect(mapped.lastViewedAt).toEqual(new Date(lastViewedAt))
	})

	it('defaults isFavorited to false when omitted', () => {
		const response: ImageStatsModel = {
			score: 10,
			view_count: 1,
			last_viewed_at: '2024-02-02T00:00:00.000Z',
		}

		const mapped = mapImageStats(response)
		expect(mapped.isFavorited).toBe(false)
	})
})

describe('mapImageContext', () => {
	it('combines summary and stats into the domain model', () => {
		const response: ImageContextResponse = {
			image: {
				id: 42,
				status: 2,
				ingested_at: '2024-03-01T00:00:00.000Z',
			},
			stats: {
				is_favorited: false,
				score: 75,
				view_count: 5,
				last_viewed_at: '2024-03-05T00:00:00.000Z',
			},
		}

		const mapped = mapImageContext(response)

		expect(mapped.image.id).toBe(42)
		expect(mapped.image.status).toBe('missing')
		expect(mapped.stats?.score).toBe(75)
		expect(mapped.stats?.lastViewedAt).toEqual(new Date('2024-03-05T00:00:00.000Z'))
	})

	it('omits stats when the response does not include them', () => {
		const response: ImageContextResponse = {
			image: {
				id: 99,
				ingested_at: '2024-03-02T00:00:00.000Z',
			},
		}

		const mapped = mapImageContext(response)

		expect(mapped.image.id).toBe(99)
		expect(mapped.image.status).toBe('active')
		expect(mapped.stats).toBeUndefined()
	})
})
