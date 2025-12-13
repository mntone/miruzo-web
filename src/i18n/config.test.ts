import { detectInitialLocale, tryMatch, supportedLocales, defaultLocale } from './config'

describe('tryMatch', () => {
	const supported = new Set(supportedLocales)

	it('matches the most specific supported tag', () => {
		expect(tryMatch('ja-JP-x-macos', supported)).toBe('ja')
		expect(tryMatch('en-US', supported)).toBe('en')
	})

	it('returns undefined for unsupported tags', () => {
		expect(tryMatch('zh-Hant', supported)).toBeUndefined()
	})
})

describe('detectInitialLocale', () => {
	const originalNavigator = globalThis.navigator

	beforeEach(() => {
		vi.restoreAllMocks()
	})

	afterEach(() => {
		Object.defineProperty(globalThis, 'navigator', {
			value: originalNavigator,
			configurable: true,
		})
	})

	it('prefers navigator.languages order', () => {
		const navigatorMock = {
			languages: ['ja-JP', 'en-US'],
			language: 'en-US',
		} satisfies Partial<Navigator>

		Object.defineProperty(globalThis, 'navigator', {
			value: navigatorMock,
			configurable: true,
		})

		expect(detectInitialLocale()).toBe('ja')
	})

	it('falls back to defaultLocale when nothing matches', () => {
		const navigatorMock = {
			languages: ['fr-FR'],
			language: 'fr-FR',
		} satisfies Partial<Navigator>

		Object.defineProperty(globalThis, 'navigator', {
			value: navigatorMock,
			configurable: true,
		})

		expect(detectInitialLocale()).toBe(defaultLocale)
	})
})
