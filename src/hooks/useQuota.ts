import { batch, createEffect, createSignal, type Accessor } from 'solid-js'

import type { QuotaEntries } from '~/domain'
import { loadQuotaIntoStore } from '~/repositories/quota'
import { quotaStore } from '~/stores/quota'

import { reportAndIgnore } from './error'

interface QuotaResource {
	readonly quotaStore: QuotaEntries
	readonly getLoaded: Accessor<boolean>
	readonly getIsPending: Accessor<boolean>
	readonly getError: Accessor<Error | undefined>

	refreshQuota(): void
}

const [getLoaded, setLoaded] = createSignal(false)
const [getIsPending, setIsPending] = createSignal(false)
const [getError, setError] = createSignal<Error | undefined>(undefined)

let retryCount: number = 0
function refreshQuota() {
	if (getLoaded() || getIsPending()) {
		return
	}

	batch(function() {
		setIsPending(true)
		setError(undefined)
	})
	++retryCount

	loadQuotaIntoStore()
		.then(function() {
			setLoaded(true)
			retryCount = 0
		}, reportAndIgnore(setError))
		.finally(setIsPending.bind(null, false))
}

const quotaResource: QuotaResource = {
	quotaStore,
	getLoaded,
	getIsPending,
	getError,

	refreshQuota,
} as const

export function useQuota(): QuotaResource {
	createEffect(function() {
		if (!getLoaded() && !getIsPending() && retryCount < 3) {
			refreshQuota()
		}
	})

	return quotaResource
}
