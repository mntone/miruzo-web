import type { Writable } from '~/@types/utils'
import type { VariantModel } from '~/api/types'

function buildVariantModelBase(
	name: string,
	slot: string,
	ext: string,
	width: number,
	height: number,
	manbytes: number,
): VariantModel {
	const newModel: Writable<VariantModel> = {
		src: `/media/${slot}/${name}.${ext}`,
		format: ext,
		w: width,
		h: height,
		manbytes,
	}
	if (ext === 'webp') {
		newModel.codecs = 'vp8'
	}
	return newModel
}

export function buildOriginalVariantModel(name: string, ext: string = 'webp'): VariantModel {
	return buildVariantModelBase(
		name,
		'original',
		ext,
		1920,
		1080,
		34,
	)
}

export function buildFallbackVariantModel(name: string, ext: string = 'jpeg'): VariantModel {
	const newModel: VariantModel = {
		src: `/media/fallback/${name}.${ext}`,
		format: ext,
		w: 1920,
		h: 1080,
		manbytes: 56,
	}
	return newModel
}

export function buildVariantModel(name: string, layer: number, width: number, ext: string): VariantModel {
	return buildVariantModelBase(
		name,
		`l${layer}w${width}`,
		ext,
		width,
		Math.floor(width * 0.75),
		Math.ceil(2 * (width / 320)),
	)
}

export function buildVariantLayerModels(name: string): VariantModel[][] {
	return [
		[
			buildVariantModel(name, 1, 320, 'webp'),
			buildVariantModel(name, 1, 480, 'webp'),
			buildVariantModel(name, 1, 640, 'webp'),
		],
		[
			buildVariantModel(name, 9, 320, 'jpeg'),
		],
	]
}
