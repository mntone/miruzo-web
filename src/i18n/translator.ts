import type { FlatLocaleMessages, TranslationKey } from './types'

export function createTranslator(getMessages: () => FlatLocaleMessages | undefined) {
	return function t<K extends TranslationKey>(key: K): string {
		const messages = getMessages()
		if (!messages) {
			return key
		}

		return messages[key] ?? key
	}
}
