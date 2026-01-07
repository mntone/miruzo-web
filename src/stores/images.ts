import { createStore } from 'solid-js/store'

import type { ImageEntry, IngestId } from '~/domain'

export const [imageStore, setImageStore] = createStore<{
	imagesById: Record<IngestId, ImageEntry>
}>({
	imagesById: {},
})
