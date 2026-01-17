import { batch, createSignal, type Accessor } from 'solid-js'

import type { IngestId } from '~/domain'
import { loveImageIntoStore } from '~/repositories'

import { reportAndIgnore } from './error'

export function useLoveAction(getIngestId: Accessor<IngestId>): readonly [() => void, Accessor<boolean>, Accessor<Error | undefined>] {
	const [getIsPending, setIsPending] = createSignal(false)
	const [getError, setError] = createSignal<Error | undefined>(undefined)

	function love() {
		if (getIsPending()) {
			return
		}

		batch(function() {
			setIsPending(true)
			setError(undefined)
		})

		loveImageIntoStore(getIngestId())
			.catch(reportAndIgnore(setError))
			.finally(setIsPending.bind(null, false))
	}

	return [love, getIsPending, getError] as const
}
