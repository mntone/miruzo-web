import type { ImageEntrySlice } from '~/domain'
import { loadImageEntryList } from '~/repositories'
import { buildImageEntry } from '~/test-utils/stubs/domain/image'
import { getExcludeFormats } from '~/utils/imageSupport'

import { useImageEntryList } from './useImageEntryList'

vi.mock('~/repositories', async () => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const actual = await vi.importActual<typeof import('~/repositories')>('~/repositories')
	return {
		...actual,
		loadImageEntryList: vi.fn(),
	}
})

vi.mock('~/utils/imageSupport', () => ({
	getExcludeFormats: vi.fn(),
}))

const loadImageEntryListMock = vi.mocked(loadImageEntryList)
const getExcludeFormatsMock = vi.mocked(getExcludeFormats)

async function flushPromises() {
	await Promise.resolve()
}

beforeEach(() => {
	loadImageEntryListMock.mockReset()
	getExcludeFormatsMock.mockReset()
})

describe('useImageEntryList', () => {
	it('exposes initial state and hasNext', () => {
		const entry = buildImageEntry(1, 'img_001')
		const initial: ImageEntrySlice = {
			entries: [entry],
			cursor: 'next',
		}

		const list = useImageEntryList(initial, { type: 'latest', limit: 50 })
		expect(list.images()).toEqual([entry])
		expect(list.isPending()).toBe(false)
		expect(list.error()).toBeUndefined()
		expect(list.hasNext()).toBe(true)
	})

	it('appends entries and clears cursor on loadNext', async () => {
		const first = buildImageEntry(1, 'img_001')
		const nextEntry = buildImageEntry(2, 'img_002')
		const initial: ImageEntrySlice = {
			entries: [first],
			cursor: 'next',
		}
		getExcludeFormatsMock.mockReturnValue(['webp'])
		loadImageEntryListMock.mockResolvedValue({
			entries: [nextEntry],
		})

		const list = useImageEntryList(initial, { type: 'latest', limit: 50 })
		list.loadNext()
		expect(list.isPending()).toBe(true)
		await flushPromises()

		expect(loadImageEntryListMock).toHaveBeenCalledWith({
			type: 'latest',
			limit: 50,
			cursor: 'next',
			excludeFormats: ['webp'],
		})
		expect(list.images()).toEqual([first, nextEntry])
		expect(list.isPending()).toBe(false)
		expect(list.hasNext()).toBe(false)
	})

	it('stores errors and clears pending state on rejection', async () => {
		const entry = buildImageEntry(1, 'img_001')
		const initial: ImageEntrySlice = {
			entries: [entry],
			cursor: 'next',
		}
		getExcludeFormatsMock.mockReturnValue(undefined)
		loadImageEntryListMock.mockRejectedValue(Error('boom'))

		const list = useImageEntryList(initial, { type: 'latest', limit: 50 })
		list.loadNext()
		await flushPromises()

		expect(list.isPending()).toBe(false)
		expect(list.error()?.message).toBe('boom')
	})

	it('reports hasNext as false when no cursor is provided', () => {
		const entry = buildImageEntry(3, 'img_003')
		const initial: ImageEntrySlice = {
			entries: [entry],
		}

		const list = useImageEntryList(initial, { type: 'latest', limit: 50 })
		expect(list.hasNext()).toBe(false)
	})
})
