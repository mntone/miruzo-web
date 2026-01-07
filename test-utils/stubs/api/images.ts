import type { ImageListModel } from '~/api/types'

import { buildFallbackVariantModel, buildOriginalVariantModel, buildVariantLayerModels } from './variants'

export function buildImageListModel(id: number, name: string): ImageListModel {
	return {
		id,
		original: buildOriginalVariantModel(name),
		fallback: buildFallbackVariantModel(name),
		variants: buildVariantLayerModels(name),
	}
}
