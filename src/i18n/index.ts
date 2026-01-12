import { createResource, createSignal } from 'solid-js'

import { detectInitialLocale, type Locale } from './config'
import { initialMessage, loadLocaleMessage } from './loader'
import { createArgumentTranslator, createPluralTranslator, createTranslator } from './translator'
import type { FlatLocaleMessages } from './types'

export interface I18nInstance {
	t: ReturnType<typeof createTranslator>
	tp: ReturnType<typeof createPluralTranslator>
	tt: ReturnType<typeof createArgumentTranslator>

	getLocale(this: void): Locale
	setLocale(this: void, locale: Locale): void
}

export function createI18n(): I18nInstance {
	const [getLocale, setLocale] = createSignal<Locale>(detectInitialLocale())

	const [getMessages] = createResource<FlatLocaleMessages, Locale>(getLocale, loadLocaleMessage, {
		initialValue: initialMessage,
	})

	const t = createTranslator(getMessages)
	const tp = createPluralTranslator(getMessages, getLocale)
	const tt = createArgumentTranslator(getMessages)
	return {
		t,
		tp,
		tt,

		getLocale,
		setLocale,
	}
}
