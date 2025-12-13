vi.mock('~/utils/imageSupport', () => ({
	supportsImageFormat: vi.fn(),
}))

import type { Variants } from '~/domain/images'
import { supportsImageFormat } from '~/utils/imageSupport'

import { getPreferredVariant } from './utils'

const supportsImageFormatMock = vi.mocked(supportsImageFormat)

beforeEach(() => {
	supportsImageFormatMock.mockReset()
})

describe('getPreferredVariant', () => {
	it('returns the smallest supported variant that satisfies the width', () => {
		supportsImageFormatMock.mockReturnValue(true)

		const variants: Variants = [
			[
				{ src: '200.webp', format: 'webp', width: 200 },
				{ src: '350.webp', format: 'webp', width: 350 },
				{ src: '500.webp', format: 'webp', width: 500 },
			],
		]

		const variant = getPreferredVariant(variants, 320)
		expect(variant).toBe(variants[0][1])
	})

	it('falls back to the layer\'s last variant when the candidate is unsupported', () => {
		supportsImageFormatMock
			.mockImplementationOnce(() => false)
			.mockImplementation(() => true)

		const variants: Variants = [
			[
				{ src: '200.webp', format: 'webp', width: 200 },
				{ src: '400.webp', format: 'webp', width: 400 },
				{ src: '500.webp', format: 'webp', width: 500 },
			],
		]

		const variant = getPreferredVariant(variants, 380)
		expect(variant).toBe(variants[0][2])
		expect(supportsImageFormatMock).toHaveBeenCalledTimes(2)
	})

	it('tries the next layer when earlier layers have no supported option', () => {
		supportsImageFormatMock
			.mockImplementationOnce(() => false)
			.mockImplementationOnce(() => false)
			.mockImplementation(() => true)

		const variants: Variants = [
			[
				{ src: 'l1-small.webp', format: 'webp', width: 200 },
				{ src: 'l1-large.webp', format: 'webp', width: 420 },
			],
			[
				{ src: 'l2-large.webp', format: 'webp', width: 420 },
			],
		]

		const variant = getPreferredVariant(variants, 350)
		expect(variant).toBe(variants[1][0])
	})

	it('throws when no supported variant exists', () => {
		supportsImageFormatMock.mockReturnValue(false)

		const variants: Variants = [
			[
				{ src: 'l1-small.webp', format: 'webp', width: 200 },
				{ src: 'l1-large.webp', format: 'webp', width: 420 },
			],
		]

		expect(() => getPreferredVariant(variants, 300)).toThrow()
	})
})
