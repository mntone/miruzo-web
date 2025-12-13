import { createResource, createSignal } from 'solid-js'

import { detectInitialLocale, type Locale } from './config'
import { initialMessage, loadLocaleMessage } from './loader'
import { createTranslator } from './translator'
import type { FlatLocaleMessages } from './types'

export interface I18nInstance {
	t: ReturnType<typeof createTranslator>

	getLocale(): Locale
	setLocale(locale: Locale): void
}

export function createI18n(): I18nInstance {
	const [getLocale, setLocale] = createSignal<Locale>(detectInitialLocale())

	const [getMessages] = createResource<FlatLocaleMessages, Locale>(getLocale, loadLocaleMessage, {
		initialValue: initialMessage,
	})

	const t = createTranslator(getMessages)
	return {
		t,

		getLocale,
		setLocale,
	}
}
