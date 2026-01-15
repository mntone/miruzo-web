import { createStore } from 'solid-js/store'

import type { QuotaEntries } from '~/domain'

export const [quotaStore, setQuotaStore] = createStore<QuotaEntries>({
	love: {
		resetAt: null,
		limit: 0,
		remaining: 0,
		used: 0,
	},
})
