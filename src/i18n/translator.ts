import { formatNumeralMessage, formatWithArgument } from './format'
import type { FlatLocaleMessages, PluralRecord, PluralTranslationKey, TextTranslationKey } from './types'

const warnedKeys = new Set<string>()

function warnMissingKey(key: string) {
	if (import.meta.env.DEV && !warnedKeys.has(key)) {
		warnedKeys.add(key)
		console.warn('Missing translation key: ' + key)
	}
}

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

		warnMissingKey(key)
		return key
	}
}

export function createArgumentTranslator(
	getMessages: () => FlatLocaleMessages | undefined,
) {
	return function tt<K extends TextTranslationKey>(key: K, ...args: ReadonlyArray<string>): string {
		const messages = getMessages()
		if (!messages) {
			return key
		}

		const message = messages[key]
		if (typeof message === 'string') {
			return formatWithArgument(message, args)
		}

		warnMissingKey(key)
		return key
	}
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
	let cachedNumberFormatterLocale: string | undefined
	let cachedNumberFormatter: ((value: number) => string) | undefined

	function getPluralRules(): Intl.PluralRules {
		const locale = getLocale()
		if (!cachedPluralRules || cachedPluralRulesLocale !== locale) {
			cachedPluralRulesLocale = locale
			cachedPluralRules = new Intl.PluralRules(locale)
		}
		return cachedPluralRules
	}

	function getNumberFormatter(): (value: number) => string {
		const locale = getLocale()
		if (!cachedNumberFormatter || cachedNumberFormatterLocale !== locale) {
			cachedNumberFormatterLocale = locale

			const numberFormatter = new Intl.NumberFormat(locale)
			// eslint-disable-next-line @typescript-eslint/unbound-method -- Intl.NumberFormat#format is bound per spec.
			cachedNumberFormatter = numberFormatter.format
		}
		return cachedNumberFormatter
	}

	const _selectMessage = selectMessage.bind(null, getPluralRules)
	// Accept text keys too; JSON resources prevent distinguishing templates statically for now.
	return function tp<K extends TextTranslationKey | PluralTranslationKey>(key: K, count: number): string {
		const messages = getMessages()
		if (!messages) {
			return key
		}

		const message = messages[key]
		if (message === undefined) {
			warnMissingKey(key)
			return key
		}

		if (typeof message === 'string') {
			return formatNumeralMessage(message, count, getNumberFormatter())
		}

		const template = _selectMessage(message, count)
		if (template === undefined) {
			warnMissingKey(key)
			return key
		}

		return formatNumeralMessage(template, count, getNumberFormatter())
	}
}
