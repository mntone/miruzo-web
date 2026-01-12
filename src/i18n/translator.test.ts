import { createArgumentTranslator, createPluralTranslator } from './translator'
import type { FlatLocaleMessages, TextTranslationKey } from './types'

function createTT<Key extends TextTranslationKey>(key: Key, template: string) {
	return createArgumentTranslator(function() {
		return {
			[key]: template,
		} as unknown as FlatLocaleMessages
	})
}

describe('createArgumentTranslator', () => {
	it('replaces indexed placeholders', () => {
		const tt = createTT('events.memo', 'message: {0}')
		expect(tt('events.memo', 'hello')).toBe('message: hello')
	})

	it('leaves placeholders without a matching argument', () => {
		const tt = createTT('events.memo', '{0} {1} {2}')
		expect(tt('events.memo', 'a', 'b')).toBe('a b {2}')
	})
})

function createTP(messages: FlatLocaleMessages) {
	return createPluralTranslator(function() {
		return messages
	}, function() {
		return 'en'
	})
}

describe('createPluralTranslator', () => {
	it('selects plural forms from a plural record', () => {
		const messages = {
			'labels.view': {
				one: '{0} view',
				other: '{0} views',
			},
		} as unknown as FlatLocaleMessages

		const tp = createTP(messages)
		expect(tp('labels.view', 1)).toBe('1 view')
		expect(tp('labels.view', 3)).toBe('3 views')
	})

	it('formats string messages as other-only plurals', () => {
		const messages = {
			'labels.view': '{0} views',
		} as unknown as FlatLocaleMessages

		const tp = createTP(messages)
		expect(tp('labels.view', 2)).toBe('2 views')
	})

	it('uses the other form when only it is provided', () => {
		const messages = {
			'labels.view': {
				other: '{0} views',
			},
		} as unknown as FlatLocaleMessages

		const tp = createTP(messages)
		expect(tp('labels.view', 1)).toBe('1 views')
		expect(tp('labels.view', 5)).toBe('5 views')
	})
})
