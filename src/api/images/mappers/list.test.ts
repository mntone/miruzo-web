import type { ImageListModel, ImageListResponse, VariantModel } from '~/api/types/list'

import { mapImageListResource, mapImageList, mapImageVariant } from './list'

type MutableEnv = {
	-readonly [K in keyof ImportMetaEnv]: ImportMetaEnv[K]
} & {
	DEV: boolean
	VITE_STATIC_ASSETS: string
}

const env = import.meta.env as MutableEnv
const originalEnv = {
	DEV: env.DEV,
	VITE_STATIC_ASSETS: env.VITE_STATIC_ASSETS,
}

beforeEach(() => {
	env.DEV = true
	env.VITE_STATIC_ASSETS = 'https://cdn.example/{host}'
	vi.stubGlobal('window', {
		location: { hostname: 'images.local' },
	} as Pick<Window, 'location'>)
})

afterEach(() => {
	env.DEV = originalEnv.DEV
	env.VITE_STATIC_ASSETS = originalEnv.VITE_STATIC_ASSETS
	vi.unstubAllGlobals()
})

describe('mapImageVariant', () => {
	it('adds the base CDN url and copies optional fields', () => {
		const response: VariantModel = {
			src: '/original/foo.avif',
			format: 'avif',
			codecs: 'av1',
			w: 1024,
			h: 768,
		}
		const mapped = mapImageVariant(response)

		expect(mapped).toEqual({
			src: 'https://cdn.example/images.local/original/foo.avif',
			format: 'avif',
			codecs: 'av1',
			width: 1024,
			height: 768,
		})
	})

	it('uses the production base url without hostname replacement', () => {
		env.DEV = false
		env.VITE_STATIC_ASSETS = 'https://static.miruzo.dev'

		const mapped = mapImageVariant({
			src: '/variants/thumb.webp',
			format: 'webp',
		})

		expect(mapped.src).toBe('https://static.miruzo.dev/variants/thumb.webp')
	})
})

describe('mapImageList', () => {
	it('maps response payloads into the internal model', () => {
		const response: ImageListModel = {
			id: 1,
			status: 1,
			original: {
				src: '/original/img_001.jpg',
				format: 'jpeg',
			},
			fallback: {
				src: '/fallback/img_001.jpg',
				format: 'jpeg',
				w: 640,
				h: 480,
			},
			variants: [
				[
					{ src: '/variants/img_001_1.jpg', format: 'jpeg', w: 800, h: 600 },
					{ src: '/variants/img_001_2.jpg', format: 'jpeg', w: 1600, h: 1200 },
				],
			],
		}

		const mapped = mapImageList(response)

		expect(mapped.id).toBe(1)
		expect(mapped.status).toBe('deleted')
		expect(mapped.original.src).toContain('/original/img_001.jpg')
		expect(mapped.fallback?.width).toBe(640)
		expect(mapped.variants[0][1].width).toBe(1600)
	})

	it('defaults to active when no status is provided', () => {
		const response: ImageListModel = {
			id: 2,
			original: { src: '/a.jpg', format: 'jpeg' },
			variants: [[]],
		}

		const mapped = mapImageList(response)

		expect(mapped.status).toBe('active')
	})
})

describe('mapImageListResource', () => {
	it('maps every summary within the list response', () => {
		const response: ImageListResponse = {
			cursor: 'next-cursor',
			items: [
				{
					id: 10,
					status: 1,
					original: { src: '/original/a.jpg', format: 'jpeg' },
					variants: [[]],
				},
			],
		}

		const mapped = mapImageListResource(response)

		expect(mapped.cursor).toBe('next-cursor')
		expect(mapped.items).toHaveLength(1)
		expect(mapped.items[0].id).toBe(10)
		expect(mapped.items[0].variants).toEqual([[]])
	})
})
