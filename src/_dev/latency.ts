import { withDelay } from '~/utils/withDelay'

interface Segment {
	// cumulative end in [0, 1]
	end: number
	max: number
}
type Segments = readonly Segment[]

function piecewiseLerp(t: number, segments: Segments): number {
	let prevEnd = 0
	let prevMax = 0
	for (const segment of segments) {
		if (t <= segment.end) {
			const span = segment.end - prevEnd
			const localT = span === 0 ? 0 : (t - prevEnd) / span
			return prevMax + (segment.max - prevMax) * localT
		}
		prevEnd = segment.end
		prevMax = segment.max
	}
	return prevMax
}

const DELAY_CONFIG: Segments = [
	{ end: 0.5, max: 333 },
	{ end: 0.9, max: 1000 },
	{ end: 1, max: 5000 },
]

if (import.meta.env.VITE_ENABLE_FETCH_DELAY === 'true') {
	if (window.__miruzoFetchDelayEnabled !== true) {
		const originalFetch = window.__miruzoOriginalFetch ?? window.fetch
		window.__miruzoOriginalFetch = originalFetch
		window.__miruzoFetchDelayEnabled = true

		window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
			const delay = Math.round(piecewiseLerp(Math.random(), DELAY_CONFIG))
			console.debug(`[dev] +${delay}ms`, input)
			return withDelay(delay, function() {
				return originalFetch(input, init)
			})
		}
	}
} else if (window.__miruzoFetchDelayEnabled === true && window.__miruzoOriginalFetch) {
	window.fetch = window.__miruzoOriginalFetch
	window.__miruzoFetchDelayEnabled = false
}
