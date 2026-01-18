import type { ImageListModel } from '~/api/types'

import { buildFallbackVariantModel, buildOriginalVariantModel, buildVariantLayerModels } from './variant'

export function buildImageListModel(id: number, name: string): ImageListModel {
	return {
		id,
		original: buildOriginalVariantModel(name),
		fallback: buildFallbackVariantModel(name),
		variants: buildVariantLayerModels(name),
	}
}
