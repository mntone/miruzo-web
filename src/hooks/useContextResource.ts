import { createEffect, createResource, type Accessor, type Resource } from 'solid-js'

import type { IngestId } from '~/domain'
import { loadContextIntoStore } from '~/repositories'

export function useContextResource(getIngestId: Accessor<IngestId>): Resource<void> {
	const [getContextResource] = createResource(getIngestId, function(params) {
		const task = loadContextIntoStore(params)
		return task
	})

	createEffect(function() {
		getContextResource()
	})

	return getContextResource
}
