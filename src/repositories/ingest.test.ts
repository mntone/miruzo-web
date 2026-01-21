import { fetchImageList } from '~/api/images'
import type { ImageListResponse } from '~/api/types'
import type { ImageEntry, IngestId } from '~/domain'
import { setImageStore } from '~/stores/image'
import { setupEnvStub } from '~/test-utils/env'
import { buildImageListModel } from '~/test-utils/stubs/api/image'
import { buildOriginalVariantEntry, buildVariantLayerEntries } from '~/test-utils/stubs/domain/variant'

import { initIngestIdListResponse, loadIngestIdList } from './ingest'

vi.mock('~/api/images', async () => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const actual = await vi.importActual<typeof import('~/api/images')>('~/api/images')
	return {
		...actual,
		fetchImageList: vi.fn(),
	}
})

vi.mock('~/stores/image', () => ({
	setImageStore: vi.fn(),
}))

setupEnvStub()

const fetchImageListMock = vi.mocked(fetchImageList)
const setImageStoreMock = vi.mocked(setImageStore)

beforeEach(() => {
	fetchImageListMock.mockReset()
	setImageStoreMock.mockReset()
})

describe('initIngestIdListResponse', () => {
	it('maps ids from image list response', () => {
		const response: ImageListResponse = {
			cursor: 'next-cursor',
			items: [
				buildImageListModel(5, 'img_005'),
				buildImageListModel(10, 'img_010'),
			],
		}

		const result = initIngestIdListResponse(response)
		expect(result.ids).toEqual([5, 10])
		expect(result.cursor).toBe('next-cursor')
	})

	it('omits cursor when not provided', () => {
		const response: ImageListResponse = {
			items: [
				buildImageListModel(1, 'img_001'),
			],
		}

		const mapped = initIngestIdListResponse(response)
		expect(mapped.ids).toEqual([1])
		expect(mapped.cursor).toBeUndefined()
	})
})

describe('loadIngestIdList', () => {
	it('loads ids, updates the store, and returns a cursor', async () => {
		const response: ImageListResponse = {
			cursor: 'next-cursor',
			items: [
				buildImageListModel(5, 'img_005'),
			],
		}
		fetchImageListMock.mockResolvedValue(response)

		const result = await loadIngestIdList({
			type: 'latest',
			limit: 50,
		})
		expect(result.ids).toEqual([5])
		expect(result.cursor).toBe('next-cursor')
		expect(fetchImageListMock).toHaveBeenCalledWith({
			type: 'latest',
			limit: 50,
		})
		expect(setImageStoreMock).toHaveBeenCalledWith('imagesById', expect.any(Function))

		const updater = setImageStoreMock.mock.calls[0][1] as (
			prev: Record<IngestId, ImageEntry>,
		) => Record<IngestId, ImageEntry>
		const previousEntry: ImageEntry = {
			id: 5,
			ingestedAt: new Date('2024-01-01T00:00:00.000Z'),
			original: buildOriginalVariantEntry('previous'),
			variants: buildVariantLayerEntries('previous'),
			stats: {
				score: 1,
				viewCount: 2,
			},
		}
		const next = updater({ 5: previousEntry })
		expect(next[5].ingestedAt).toEqual(previousEntry.ingestedAt)
		expect(next[5].stats).toBe(previousEntry.stats)
		expect(next[5].original.src).toContain('/media/original/img_005.webp')
	})
})
