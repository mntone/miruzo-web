import { DEFAULT_IMAGE_LIST_LIMIT, IMAGE_LIST_LIMIT_MAX, IMAGE_LIST_LIMIT_MIN } from './limit'
import { buildImageListParams } from './query'

describe('buildImageListParams', () => {
	it('omits cursor and exclude_formats when not provided', () => {
		const params = buildImageListParams({
			limit: DEFAULT_IMAGE_LIST_LIMIT,
		})
		expect(params).toBeUndefined()
	})

	it('sets cursor and exclude_formats when provided', () => {
		const params = buildImageListParams({
			cursor: 'cursor123',
			excludeFormats: ['avif', 'webp'],
			limit: DEFAULT_IMAGE_LIST_LIMIT,
		})
		expect(params).not.toBeUndefined()
		expect(params!.get('cursor')).toBe('cursor123')
		expect(params!.get('exclude_formats')).toBe('avif+webp')
		expect(params!.get('limit')).toBeNull()
	})

	it('sets limit when provided', () => {
		const params = buildImageListParams({
			limit: DEFAULT_IMAGE_LIST_LIMIT + 1,
		})
		expect(params).not.toBeUndefined()
		expect(params!.get('limit')).toBe(`${DEFAULT_IMAGE_LIST_LIMIT + 1}`)
	})

	const devIt = import.meta.env.DEV ? it : it.skip
	devIt('throws when limit is below the minimum', () => {
		expect(() => {
			buildImageListParams({
				limit: IMAGE_LIST_LIMIT_MIN - 1,
			})
		}).toThrow()
	})

	devIt('throws when limit is above the maximum', () => {
		expect(() => {
			buildImageListParams({
				limit: IMAGE_LIST_LIMIT_MAX + 1,
			})
		}).toThrow()
	})

	it('clamps limit below the minimum when DEV is false', () => {
		vi.stubEnv('DEV', false)
		try {
			const params = buildImageListParams({
				limit: IMAGE_LIST_LIMIT_MIN - 1,
			})
			expect(params).not.toBeUndefined()
			expect(params!.get('limit')).toBe(`${IMAGE_LIST_LIMIT_MIN}`)
		} finally {
			vi.unstubAllEnvs()
		}
	})

	it('clamps limit above the maximum when DEV is false', () => {
		vi.stubEnv('DEV', false)
		try {
			const params = buildImageListParams({
				limit: IMAGE_LIST_LIMIT_MAX + 1,
			})
			expect(params).not.toBeUndefined()
			expect(params!.get('limit')).toBe(`${IMAGE_LIST_LIMIT_MAX}`)
		} finally {
			vi.unstubAllEnvs()
		}
	})
})
