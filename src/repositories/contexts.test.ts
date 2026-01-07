/* eslint-disable camelcase */

import { fetchContextById } from '~/api/images'
import type { ContextResponse, StatsModel } from '~/api/types'
import type { ImageEntry } from '~/domain'
import { setImageStore } from '~/stores/images'
import { setupEnvStub } from '~/test-utils/env'
import { buildOriginalVariantEntry, buildVariantLayerEntries } from '~/test-utils/stubs/domain/variants'

import { applyContext, initStatsEntry, loadContextIntoStore } from './contexts'

vi.mock('~/api/images', () => ({
	fetchContextById: vi.fn(),
}))

vi.mock('~/stores/images', () => ({
	setImageStore: vi.fn(),
}))

setupEnvStub()

const fetchContextByIdMock = vi.mocked(fetchContextById)
const setImageStoreMock = vi.mocked(setImageStore)

beforeEach(() => {
	fetchContextByIdMock.mockReset()
	setImageStoreMock.mockReset()
})

describe('initStatsEntry', () => {
	it('maps stats flags and aggregates to camelCase fields', () => {
		const milestoneArchivedAt = '2024-01-24T00:00:00.000000Z'
		const lastViewedAt = '2024-02-01T00:00:00.000000Z'

		const response: StatsModel = {
			score: 200,
			view_count: 24,
			last_viewed_at: lastViewedAt,
			view_milestone_count: 100,
			view_milestone_archived_at: milestoneArchivedAt,
		}

		const mapped = initStatsEntry(response)
		expect(mapped).toMatchObject({
			score: 200,
			viewCount: 24,
			viewMilestoneCount: 100,
		})
		expect(mapped.lastViewedAt).toEqual(new Date(lastViewedAt))
		expect(mapped.viewMilestoneArchivedAt).toEqual(new Date(milestoneArchivedAt))
	})
})

describe('applyContext', () => {
	it('applies context response data into an existing image entry', () => {
		const entry: ImageEntry = {
			id: 123,
			original: buildOriginalVariantEntry('foo'),
			variants: buildVariantLayerEntries('foo'),
		}

		const ingestedAt = '2024-03-01T12:00:00.000000Z'
		const lastViewedAt = '2024-03-05T08:00:00.000000Z'
		const response: ContextResponse = {
			image: {
				id: 42,
				ingested_at: ingestedAt,
			},
			stats: {
				score: 75,
				view_count: 5,
				last_viewed_at: lastViewedAt,
			},
		}

		applyContext(entry, response)

		expect(entry.id).toBe(123)
		expect(entry.ingestedAt).toEqual(new Date(ingestedAt))
		expect(entry.stats).toMatchObject({
			score: 75,
			viewCount: 5,
		})
		expect(entry.stats?.lastViewedAt).toEqual(new Date(lastViewedAt))
	})

	it('omits stats when the context response does not include them', () => {
		const entry: ImageEntry = {
			id: 123,
			original: buildOriginalVariantEntry('foo'),
			variants: buildVariantLayerEntries('foo'),
		}

		const ingestedAt = '2024-03-02T18:00:00.000000Z'
		const response: ContextResponse = {
			image: {
				id: 99,
				ingested_at: ingestedAt,
			},
		}

		applyContext(entry, response)

		expect(entry.id).toBe(123)
		expect(entry.ingestedAt).toEqual(new Date(ingestedAt))
		expect(entry.stats).toBeUndefined()
	})
})

describe('loadContextIntoStore', () => {
	it('fetches context and updates the image entry', async () => {
		const ingestedAt = '2024-03-01T12:00:00.000000Z'
		const lastViewedAt = '2024-03-05T08:00:00.000000Z'
		const response: ContextResponse = {
			image: {
				id: 123,
				ingested_at: ingestedAt,
			},
			stats: {
				score: 75,
				view_count: 5,
				last_viewed_at: lastViewedAt,
			},
		}
		fetchContextByIdMock.mockResolvedValue(response)

		await loadContextIntoStore(123)

		expect(fetchContextByIdMock).toHaveBeenCalledWith(123)
		expect(setImageStoreMock).toHaveBeenCalledWith(
			'imagesById',
			123,
			expect.any(Function),
		)

		const updater = setImageStoreMock.mock.calls[0][2] as (
			prev: ImageEntry | undefined,
		) => ImageEntry
		const previousEntry: ImageEntry = {
			id: 123,
			original: buildOriginalVariantEntry('foo'),
			variants: buildVariantLayerEntries('foo'),
		}
		const next = updater(previousEntry)
		expect(next.id).toBe(123)
		expect(next.ingestedAt).toEqual(new Date(ingestedAt))
		expect(next.stats?.viewCount).toBe(5)
		expect(next.stats?.lastViewedAt).toEqual(new Date(lastViewedAt))
	})

	it('throws when the image entry does not exist', async () => {
		const response: ContextResponse = {
			image: {
				id: 999,
				ingested_at: '2024-03-02T18:00:00.000000Z',
			},
		}
		fetchContextByIdMock.mockResolvedValue(response)

		await loadContextIntoStore(999)

		const updater = setImageStoreMock.mock.calls[0][2] as (
			prev: ImageEntry | undefined,
		) => ImageEntry
		expect(() => updater(undefined)).toThrow('ImageEntry must exist to apply context')
	})
})
