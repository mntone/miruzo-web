import './index.css'

/* @refresh reload */
import { render } from 'solid-js/web'

import { I18nProvider } from '~/i18n/Context.tsx'
import { preloadImageFormatSupport } from '~/utils/imageSupport'

import { App } from './App.tsx'

const app = document.getElementById('app')
if (!app) {
	throw Error('.app not found')
}

void preloadImageFormatSupport().then(function() {
	render(function() {
		return (
			<I18nProvider>
				<App />
			</I18nProvider>
		)
	}, app)
})
