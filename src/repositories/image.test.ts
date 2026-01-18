import { setupEnvStub } from '~/test-utils/env'
import { buildImageListModel } from '~/test-utils/stubs/api/images'
import { buildFallbackVariantEntry, buildOriginalVariantEntry, buildVariantLayerEntries } from '~/test-utils/stubs/domain/variant'

import { initImageEntry } from './image'

setupEnvStub()

describe('initImageEntry', () => {
	it('maps image into entry', () => {
		const response = buildImageListModel(1, 'img_001')

		const mapped = initImageEntry(response)
		expect(mapped).toMatchObject({
			id: 1,
			original: buildOriginalVariantEntry('img_001'),
			fallback: buildFallbackVariantEntry('img_001'),
			variants: buildVariantLayerEntries('img_001'),
		})
	})
})
