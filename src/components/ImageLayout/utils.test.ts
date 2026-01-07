vi.mock('~/utils/imageSupport', () => ({
	supportsImageFormat: vi.fn(),
}))
import type { VariantLayerEntries } from '~/domain'
import { supportsImageFormat } from '~/utils/imageSupport'

import { getPreferredVariant } from './utils'

const supportsImageFormatMock = vi.mocked(supportsImageFormat)

beforeEach(() => {
	supportsImageFormatMock.mockReset()
})

describe('getPreferredVariant', () => {
	it('returns the smallest supported variant that satisfies the width', () => {
		supportsImageFormatMock.mockReturnValue(true)

		const variants: VariantLayerEntries = [
			[
				{ src: '320.webp', format: 'webp', manbytes: 2, width: 320, height: 240 },
				{ src: '480.webp', format: 'webp', manbytes: 3, width: 480, height: 360 },
				{ src: '640.webp', format: 'webp', manbytes: 4, width: 640, height: 480 },
			],
		]

		const variant = getPreferredVariant(variants, 420)
		expect(variant).toBe(variants[0][1])
	})

	it('falls back to the layer\'s last variant when the candidate is unsupported', () => {
		supportsImageFormatMock
			.mockImplementationOnce(() => false)
			.mockImplementation(() => true)

		const variants: VariantLayerEntries = [
			[
				{ src: '320.avif', format: 'avif', manbytes: 2, width: 320, height: 240 },
				{ src: '480.webp', format: 'webp', manbytes: 3, width: 480, height: 360 },
				{ src: '640.webp', format: 'webp', manbytes: 4, width: 640, height: 480 },
			],
		]

		const variant = getPreferredVariant(variants, 420)
		expect(variant).toBe(variants[0][2])
		expect(supportsImageFormatMock).toHaveBeenCalledTimes(2)
	})

	it('tries the next layer when earlier layers have no supported option', () => {
		supportsImageFormatMock
			.mockImplementationOnce(() => false)
			.mockImplementationOnce(() => false)
			.mockImplementation(() => true)

		const variants: VariantLayerEntries = [
			[
				{ src: 'l1-small.jxl', format: 'jxl', manbytes: 2, width: 320, height: 240 },
				{ src: 'l1-medium.jxl', format: 'jxl', manbytes: 3, width: 480, height: 360 },
			],
			[
				{ src: 'l2-large.jpg', format: 'jpeg', manbytes: 5, width: 640, height: 480 },
			],
		]

		const variant = getPreferredVariant(variants, 480)
		expect(variant).toBe(variants[1][0])
	})

	it('throws when no supported variant exists', () => {
		supportsImageFormatMock.mockReturnValue(false)

		const variants: VariantLayerEntries = [
			[
				{ src: 'l1-small.webp', format: 'webp', manbytes: 2, width: 320, height: 240 },
				{ src: 'l1-large.webp', format: 'webp', manbytes: 3, width: 480, height: 360 },
				{ src: 'l1-large.webp', format: 'webp', manbytes: 3, width: 480, height: 360 },
			],
		]

		expect(() => getPreferredVariant(variants, 320)).toThrow()
	})
})
