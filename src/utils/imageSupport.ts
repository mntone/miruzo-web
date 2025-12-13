const supportFormat: Record<string, boolean> = {
	gif: true,
	jpeg: true,
	png: true,
} as const

function makeKey(format: string, codecs?: string): string {
	return codecs ? `${format}:${codecs}` : format
}

async function detectFormat(format: string, codecs?: string): Promise<boolean> {
	const tinyImage: Record<string, string> = {
		// avif: 'AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
		'webp:vp8': 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
		'webp:vp8l': 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
	} as const

	const key = makeKey(format, codecs)
	const base64 = tinyImage[key]
	if (!base64) {
		supportFormat[key] = false
		return Promise.resolve(false)
	}

	return new Promise(function(resolve, reject) {
		const image = new Image()
		image.onload = function() {
			const result = image.width > 0 && image.height > 0
			supportFormat[key] = result
			resolve(result)
		}
		image.onerror = function(e) {
			supportFormat[key] = false
			reject(e instanceof Error ? e : new Error(`Failed to detect ${key} support`))
		}
		image.src = 'data:image/' + format + ';base64,' + base64
	})
}

export function preloadImageFormatSupport() {
	return Promise.all([
		// detectFormat("avif"),
		detectFormat('webp', 'vp8'),
		detectFormat('webp', 'vp8l'),
	])
}

export function supportsImageFormat(format: string, codecs?: string): boolean {
	const key = makeKey(format, codecs)
	return supportFormat[key]
}

export function getExcludeFormats(): readonly string[] | undefined {
	return supportsImageFormat('webp', 'vp8') ? undefined : ['webp']
}
