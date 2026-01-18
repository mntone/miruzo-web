import { describe, expect, it } from 'vitest'

import { DEFAULT_IMAGE_LIST_LIMIT } from './limit'
import { buildImageListParams } from './query'

describe('buildImageListParams', () => {
	it('omits cursor and exclude_formats when not provided', () => {
		const params = buildImageListParams(DEFAULT_IMAGE_LIST_LIMIT)
		expect(params).toBeUndefined()
	})

	it('sets cursor, exclude_formats, and limit when provided', () => {
		const params = buildImageListParams(25, 'cursor123', ['avif', 'webp'])
		expect(params).not.toBeUndefined()
		expect(params!.get('cursor')).toBe('cursor123')
		expect(params!.get('exclude_formats')).toBe('avif+webp')
		expect(params!.get('limit')).toBe('25')
	})
})
