export const supportedLocales = ['en', 'ja'] as const
export type Locale = (typeof supportedLocales)[number]

export const defaultLocale: Locale = 'en'

const supportedLocaleSet = new Set<string>(supportedLocales)

// BCP47 lookup per RFC 5646 / 4647.
// Remove the trailing subtags one by one and try each variant
// from most specific to most generic (e.g. zh-Hant-TW → zh-Hant → zh).
export function tryMatch(tag: string, supportedLocale: ReadonlySet<string>): Locale | undefined {
	let current = tag.toLowerCase()

	while (true) {
		if (supportedLocale.has(current)) {
			return current as Locale
		}

		const idx = current.lastIndexOf('-')
		if (idx === -1) {
			break
		}

		current = current.substring(0, idx)
	}
	return undefined
}

// Pick the best locale from the user's preferences (RFC 4647 lookup)
export function detectInitialLocale(): Locale {
	const candidates = navigator !== undefined && navigator.languages?.length
		? navigator.languages
		: [navigator.language]

	for (const tag of candidates) {
		const match = tryMatch(tag, supportedLocaleSet)
		if (match) {
			return match
		}
	}

	return defaultLocale
}
