import { bench } from 'vitest'

import { flattenMessages } from './loader'
import type { LocaleRecord } from './types'

const testDict: LocaleRecord = {
	common: {
		hello: 'Hello',
		cancel: 'Cancel',
		ok: 'Ok',
		nested: {
			value: 'Nested value',
			deep: {
				one: 'Deep One',
				two: 'Deep Two',
			},
		},
	},
	account: {
		login: 'Login',
		logout: 'Logout',
		settings: 'Settings',
		profile: {
			name: 'Name',
			email: 'Email',
			bio: 'Bio',
		},
	},
	notifications: {
		new: 'New notification',
		old: 'Old notification',
	},
}

function flattenIterative(messages: LocaleRecord) {
	const entries: Record<string, string> = {}
	const stack: Array<{ key: string, value: string | LocaleRecord }> = []

	const rootKeys = Object.keys(messages)
	for (let i = 0, len = rootKeys.length; i < len; i++) {
		const key = rootKeys[i]
		stack.push({ key, value: messages[key] })
	}

	while (stack.length) {
		const frame = stack.pop()!
		const key = frame.key
		const value = frame.value
		if (typeof value === 'string') {
			entries[key] = value
			continue
		}

		const childKeys = Object.keys(value)
		for (let i = 0, len = childKeys.length; i < len; i++) {
			const childKey = childKeys[i]
			stack.push({ key: `${key}.${childKey}`, value: value[childKey] })
		}
	}

	return entries
}

// Benchmark --------------------------------------------------------

describe('flattenMessage performance', () => {
	const options = { warmupIterations: 1000, warmupTime: 500 }

	bench('recursive', () => {
		const res = flattenMessages(testDict)
		expect(Object.keys(res).length).toBeGreaterThan(0)
	}, options)

	bench('iterative', () => {
		const res = flattenIterative(testDict)
		expect(Object.keys(res).length).toBeGreaterThan(0)
	}, options)
})
