import { flattenMessages } from './loader'
import type { LocaleRecord } from './types'

describe('flattenMessages', () => {
	it('flattens nested locale records into dot-notated keys', () => {
		const dict: LocaleRecord = {
			common: {
				ok: 'Ok',
				cancel: 'Cancel',
				title: {
					short: 'Short',
					long: 'Long title',
				},
			},
			auth: {
				login: 'Login',
				logout: 'Logout',
			},
		}

		expect(flattenMessages(dict)).toStrictEqual({
			'common.ok': 'Ok',
			'common.cancel': 'Cancel',
			'common.title.short': 'Short',
			'common.title.long': 'Long title',
			'auth.login': 'Login',
			'auth.logout': 'Logout',
		})
	})

	it('handles locales without nested objects', () => {
		const dict: LocaleRecord = {
			header: {
				title: 'Title',
			},
		}

		expect(flattenMessages(dict)).toStrictEqual({
			'header.title': 'Title',
		})
	})
})
