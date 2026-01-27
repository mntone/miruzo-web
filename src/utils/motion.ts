let cachedReducedMotion: MediaQueryList | undefined
export function getReducedMotion(): MediaQueryList {
	if (cachedReducedMotion === undefined) {
		cachedReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
	}
	return cachedReducedMotion
}

export function prefersReducedMotion(): boolean {
	return getReducedMotion().matches
}
