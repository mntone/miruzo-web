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

	it('keeps plural records as leaf entries', () => {
		const dict: LocaleRecord = {
			labels: {
				items: {
					one: '{0} item',
					other: '{0} items',
				},
			},
		}

		expect(flattenMessages(dict)).toStrictEqual({
			'labels.items': {
				one: '{0} item',
				other: '{0} items',
			},
		})
	})

	it('keeps other-only plural records as leaf entries', () => {
		const dict: LocaleRecord = {
			labels: {
				items: {
					other: '{0} items',
				},
			},
		}

		expect(flattenMessages(dict)).toStrictEqual({
			'labels.items': {
				other: '{0} items',
			},
		})
	})
})
