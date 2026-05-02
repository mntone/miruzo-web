import { batch, createSignal, type Accessor } from 'solid-js'

import type { IngestId } from '~/domain'
import { grantHallOfFameIntoStore } from '~/repositories/reactions'

import { reportAndIgnore } from './error'

export function useHallOfFameGrantedAction(getIngestId: Accessor<IngestId>): readonly [() => void, Accessor<boolean>, Accessor<Error | undefined>] {
	const [getIsPending, setIsPending] = createSignal(false)
	const [getError, setError] = createSignal<Error | undefined>(undefined)

	function grantHallOfFame() {
		if (getIsPending()) {
			return
		}

		batch(function() {
			setIsPending(true)
			setError(undefined)
		})

		grantHallOfFameIntoStore(getIngestId())
			.catch(reportAndIgnore(setError))
			.finally(setIsPending.bind(null, false))
	}

	return [grantHallOfFame, getIsPending, getError] as const
}
