import type { Writable } from '~/@types/utils'
import type { VariantEntry } from '~/domain'

function buildVariantEntryBase(
	name: string,
	slot: string,
	ext: string,
	width: number,
	height: number,
	manbytes: number,
	host: string,
): VariantEntry {
	const newEntry: Writable<VariantEntry> = {
		src: `https://${host}/media/${slot}/${name}.${ext}`,
		format: ext,
		width,
		height,
		manbytes,
	}
	if (ext === 'webp') {
		newEntry.codecs = 'vp8'
	}
	return newEntry
}

export function buildOriginalVariantEntry(
	name: string,
	ext: string = 'webp',
	host: string = 'images.local',
): VariantEntry {
	return buildVariantEntryBase(
		name,
		'original',
		ext,
		1920,
		1080,
		34,
		host,
	)
}

export function buildFallbackVariantEntry(
	name: string,
	ext: string = 'jpeg',
	host: string = 'images.local',
): VariantEntry {
	return buildVariantEntryBase(
		name,
		'fallback',
		ext,
		1920,
		1080,
		56,
		host,
	)
}

export function buildVariantEntry(
	name: string,
	layer: number,
	width: number,
	ext: string,
	host: string = 'images.local',
): VariantEntry {
	return buildVariantEntryBase(
		name,
		`l${layer}w${width}`,
		ext,
		width,
		Math.floor(width * 0.75),
		Math.ceil(2 * (width / 320)),
		host,
	)
}

export function buildVariantLayerEntries(name: string): VariantEntry[][] {
	return [
		[
			buildVariantEntry(name, 1, 320, 'webp'),
			buildVariantEntry(name, 1, 480, 'webp'),
			buildVariantEntry(name, 1, 640, 'webp'),
		],
		[
			buildVariantEntry(name, 9, 320, 'jpeg'),
		],
	]
}
