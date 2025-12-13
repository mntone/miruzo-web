import type { Locale } from './config'
import dict from './locales/en.json'
import type { FlatLocaleMessages, LocaleMessages, LocaleRecord, Flatten } from './types'

export function flattenMessages<T extends LocaleRecord>(messages: T): Flatten<T> {
	const entries: Record<string, string> = {}

	function traverse(node: string | LocaleRecord, currentKey: string) {
		if (typeof node === 'string') {
			entries[currentKey] = node
			return
		}

		for (const key of Object.keys(node)) {
			const nextKey = currentKey ? `${currentKey}.${key}` : key
			traverse(node[key], nextKey)
		}
	}

	for (const key of Object.keys(messages)) {
		traverse(messages[key], key)
	}

	return entries as Flatten<T>
}

export const initialMessage: FlatLocaleMessages = flattenMessages(dict)

export function loadLocaleMessage(locale: Locale): Promise<FlatLocaleMessages> {
	if (locale === 'en') {
		return Promise.resolve(initialMessage)
	}

	return import(`./locales/${locale}.json`).then(function(module: { default: LocaleMessages }) {
		return flattenMessages(module.default)
	})
}
