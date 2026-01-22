import type { ImageEntry, IngestIdListResponse } from '~/domain'
import { imageStore } from '~/stores/image'
import { buildImageEntry } from '~/test-utils/stubs/domain/image'

import { createImageEntrySlice } from './imageList'

vi.mock('~/stores/image', () => {
	const imageStore = { imagesById: {} as Record<number, ImageEntry> }
	return { imageStore }
})

beforeEach(() => {
	imageStore.imagesById = {}
})

describe('createImageEntrySlice', () => {
	it('maps ids to entries and keeps order', () => {
		const first = buildImageEntry(1, 'img_001')
		const second = buildImageEntry(2, 'img_002')
		imageStore.imagesById = {
			1: first,
			2: second,
		}

		const response: IngestIdListResponse = {
			ids: [2, 1],
			cursor: 'next',
		}

		const slice = createImageEntrySlice(response)
		if (slice === undefined) {
			throw Error('Expected slice to be defined')
		}
		expect(slice.entries).toEqual([second, first])
		expect(slice.cursor).toBe('next')
	})

	it('omits cursor when missing', () => {
		const entry = buildImageEntry(5, 'img_005')
		imageStore.imagesById = { 5: entry }

		const response: IngestIdListResponse = {
			ids: [5],
		}

		const slice = createImageEntrySlice(response)
		if (slice === undefined) {
			throw Error('Expected slice to be defined')
		}
		expect(slice.entries).toEqual([entry])
		expect(slice.cursor).toBeUndefined()
	})

	it('returns undefined when ids are empty', () => {
		const response: IngestIdListResponse = {
			ids: [],
		}

		expect(createImageEntrySlice(response)).toBeUndefined()
	})

	it('throws when an entry is missing from the store', () => {
		const response: IngestIdListResponse = {
			ids: [10],
		}

		expect(() => createImageEntrySlice(response)).toThrow(
			'Image entry 10 is missing in the store',
		)
	})
})
