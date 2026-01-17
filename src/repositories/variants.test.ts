import type { VariantModel } from '~/api/types'
import { setupEnvStub } from '~/test-utils/env'

import { getBaseUrl, initVariantEntry, initVariantLayerResources } from './variants'

const env = setupEnvStub()

describe('getBaseUrl', () => {
	it('replaces host and protocol in development', () => {
		env.DEV = true
		env.VITE_STATIC_ASSET_HOST = '{host}:8080'
		env.VITE_STATIC_ASSET_PROTOCOL = '{protocol}'

		expect(getBaseUrl()).toBe('https://images.local:8080')
	})

	it('returns a protocol-relative base when protocol is empty', () => {
		env.DEV = false
		env.VITE_STATIC_ASSET_HOST = 'static.miruzo.dev'
		env.VITE_STATIC_ASSET_PROTOCOL = ''

		expect(getBaseUrl()).toBe('//static.miruzo.dev')
	})

	it('returns an empty string when host is empty', () => {
		env.DEV = false
		env.VITE_STATIC_ASSET_HOST = ''
		env.VITE_STATIC_ASSET_PROTOCOL = 'https:'

		expect(getBaseUrl()).toBe('')
	})
})

describe('initVariantEntry', () => {
	it('adds the base assets url and copies optional fields', () => {
		const response: VariantModel = {
			src: '/media/original/foo.avif',
			format: 'avif',
			w: 1920,
			h: 1080,
			manbytes: 34,
		}

		const mapped = initVariantEntry(response)
		expect(mapped).toMatchObject({
			src: 'https://images.local/media/original/foo.avif',
			format: 'avif',
			width: 1920,
			height: 1080,
			manbytes: 34,
		})
	})

	it('uses the production base url without hostname and protocol replacement', () => {
		env.DEV = false
		env.VITE_STATIC_ASSET_HOST = 'static.miruzo.dev'
		env.VITE_STATIC_ASSET_PROTOCOL = 'https:'

		const response: VariantModel = {
			src: '/media/variants/thumb.webp',
			format: 'webp',
			w: 320,
			h: 240,
			manbytes: 2,
		}

		const mapped = initVariantEntry(response)
		expect(mapped.src).toBe('https://static.miruzo.dev/media/variants/thumb.webp')
	})

	it('uses the production base url without hostname replacement', () => {
		env.DEV = false
		env.VITE_STATIC_ASSET_HOST = 'static.miruzo.dev'
		env.VITE_STATIC_ASSET_PROTOCOL = ''

		const response: VariantModel = {
			src: '/media/variants/thumb.webp',
			format: 'webp',
			w: 320,
			h: 240,
			manbytes: 2,
		}

		const mapped = initVariantEntry(response)
		expect(mapped.src).toBe('//static.miruzo.dev/media/variants/thumb.webp')
	})
})

describe('initVariantLayerResources', () => {
	it('maps variant layers into entry arrays', () => {
		const response = [
			[
				{
					src: '/media/l1w320/foo.webp',
					format: 'webp',
					codecs: 'vp8',
					w: 320,
					h: 240,
					manbytes: 2,
				},
				{
					src: '/media/l1w480/foo.webp',
					format: 'webp',
					codecs: 'vp8',
					w: 480,
					h: 360,
					manbytes: 3,
				},
				{
					src: '/media/l1w640/foo.webp',
					format: 'webp',
					codecs: 'vp8',
					w: 640,
					h: 480,
					manbytes: 4,
				},
			],
			[
				{
					src: '/media/l9w320/foo.jpeg',
					format: 'jpeg',
					w: 320,
					h: 240,
					manbytes: 5,
				},
			],
		]

		const mapped = initVariantLayerResources(response)
		expect(mapped).toHaveLength(2)
		expect(mapped[0]).toHaveLength(3)
		expect(mapped[1]).toHaveLength(1)

		expect(mapped[0][0]).toMatchObject({
			src: 'https://images.local/media/l1w320/foo.webp',
			format: 'webp',
			codecs: 'vp8',
			width: 320,
			height: 240,
			manbytes: 2,
		})
		expect(mapped[0][1]).toMatchObject({
			src: 'https://images.local/media/l1w480/foo.webp',
			format: 'webp',
			codecs: 'vp8',
			width: 480,
			height: 360,
			manbytes: 3,
		})
		expect(mapped[0][2]).toMatchObject({
			src: 'https://images.local/media/l1w640/foo.webp',
			format: 'webp',
			codecs: 'vp8',
			width: 640,
			height: 480,
			manbytes: 4,
		})
		expect(mapped[1][0]).toMatchObject({
			src: 'https://images.local/media/l9w320/foo.jpeg',
			format: 'jpeg',
			width: 320,
			height: 240,
			manbytes: 5,
		})
	})
})
