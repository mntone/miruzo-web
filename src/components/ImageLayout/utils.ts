import type { VariantEntry, VariantLayerEntries } from '~/domain'
import { supportsImageFormat } from '~/utils/imageSupport'

/**
 * Pick the smallest variant that satisfies the required width and is supported by the browser.
 */
export function getPreferredVariant(variants: VariantLayerEntries, requiredWidth: number): VariantEntry {
	const lastLayerIndex = variants.length - 1

	for (let i = 0; i < variants.length; ++i) {
		const layer = variants[i]

		// 1. 通常探索：要求幅を満たす最小の variant を探す
		for (const spec of layer) {
			if (spec.width && requiredWidth <= spec.width) {
				if (supportsImageFormat(spec.format, spec.codecs)) {
					return spec
				}
				break
			}
		}

		// 2. fallback を layer 内で取るのは「最終 layer（JPEGなど）」だけ
		if (i === lastLayerIndex) {
			const fallback = layer.at(-1)!
			if (supportsImageFormat(fallback.format, fallback.codecs)) {
				return fallback
			}
		}
	}

	throw Error('No supported image variant is available')
}
