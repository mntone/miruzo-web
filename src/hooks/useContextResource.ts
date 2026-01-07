import { createEffect, createResource, type Accessor } from 'solid-js'

import { loadContextIntoStore } from '~/repositories'

export function useContextResource(getIngestId: Accessor<number>) {
	const [getContextResource] = createResource(getIngestId, function(params) {
		const task = loadContextIntoStore(params)
		return task
	})

	createEffect(function() {
		getContextResource()
	})

	return getContextResource
}
