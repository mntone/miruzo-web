import type { FlatLocaleMessages, PluralRecord, PluralTranslationKey, TextTranslationKey } from './types'

export function createTranslator(getMessages: () => FlatLocaleMessages | undefined) {
	return function t<K extends TextTranslationKey>(key: K): string {
		const messages = getMessages()
		if (!messages) {
			return key
		}

		const message = messages[key]
		if (typeof message === 'string') {
			return message
		}

		return key
	}
}

function formatMessage(
	getNumberFormat: () => Intl.NumberFormat,
	template: string,
	count: number,
): string {
	const value = getNumberFormat().format(count)
	return template.replace(/\{0\}/g, value)
}

function selectMessage(
	getPluralRules: () => Intl.PluralRules,
	message: PluralRecord,
	count: number,
): string | undefined {
	const category = getPluralRules().select(count)
	return message[category] ?? message.other
}

export function createPluralTranslator(
	getMessages: () => FlatLocaleMessages | undefined,
	getLocale: () => string,
) {
	let cachedPluralRulesLocale: string | undefined
	let cachedPluralRules: Intl.PluralRules | undefined
	let cachedNumberFormatLocale: string | undefined
	let cachedNumberFormat: Intl.NumberFormat | undefined

	function getPluralRules(): Intl.PluralRules {
		const locale = getLocale()
		if (!cachedPluralRules || cachedPluralRulesLocale !== locale) {
			cachedPluralRulesLocale = locale
			cachedPluralRules = new Intl.PluralRules(locale)
		}
		return cachedPluralRules
	}

	function getNumberFormat(): Intl.NumberFormat {
		const locale = getLocale()
		if (!cachedNumberFormat || cachedNumberFormatLocale !== locale) {
			cachedNumberFormatLocale = locale
			cachedNumberFormat = new Intl.NumberFormat(locale)
		}
		return cachedNumberFormat
	}

	const _formatMessage = formatMessage.bind(null, getNumberFormat)
	const _selectMessage = selectMessage.bind(null, getPluralRules)
	return function tp<K extends PluralTranslationKey>(key: K, count: number): string {
		const messages = getMessages()
		if (!messages) {
			return key
		}

		const message = messages[key]
		if (!message) {
			return key
		}

		if (typeof message === 'string') {
			return _formatMessage(message, count)
		}

		const template = _selectMessage(message, count)
		if (!template) {
			return key
		}

		return _formatMessage(template, count)
	}
}
