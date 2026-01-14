import { createSignal, type Accessor } from 'solid-js'

import type { IngestId } from '~/domain'
import { loveImageIntoStore } from '~/repositories'

export function useLoveAction(getIngestId: Accessor<IngestId>): [() => void, Accessor<boolean>, Accessor<Error | undefined>] {
	const [getIsPending, setIsPending] = createSignal(false)
	const [getError, setError] = createSignal<Error | undefined>(undefined)

	function love() {
		if (getIsPending()) {
			return
		}

		setIsPending(true)
		setError(undefined)

		loveImageIntoStore(getIngestId())
			.catch(setError)
			.finally(setIsPending.bind(null, false))
	}

	return [love, getIsPending, getError]
}
