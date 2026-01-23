import { createContext, createEffect, useContext, type ParentProps } from 'solid-js'

import { createI18n, type I18nInstance } from './index'

const I18nContext = createContext<I18nInstance>()

export function I18nProvider(props: ParentProps) {
	const i18n = createI18n()

	// Set initial lang attribute
	document.documentElement.lang = i18n.getLocale()

	// Update lang attribute on locale change
	createEffect(function() {
		document.documentElement.lang = i18n.getLocale()
	})

	return (
		<I18nContext.Provider value={i18n}>
			{props.children}
		</I18nContext.Provider>
	)
}

export function useI18n() {
	const ctx = useContext(I18nContext)
	if (ctx === undefined) {
		throw Error('useI18n() must be used inside <I18nProvider>')
	}
	return ctx
}
