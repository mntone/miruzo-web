import type { LayoutInterval } from '~/components/ImageLayout'

// TopPage keeps bespoke intervals to preserve its intended grid density.
export const topPageIntervals: readonly LayoutInterval[] = [
	// 1–2 columns (minItemWidth=160–, gap=8)
	{ colEnd: 2, minItemWidth: 160, spacing: 10, outerPadding: 14 },

	// 3 columns (minItemWidth=210–320, gap=8)
	{ colEnd: 3, minItemWidth: 210, maxItemWidth: 320, spacing: 10, outerPadding: 14 },

	// 4+ columns (open-ended range)
	{ itemWidth: 320, spacing: 10, outerPadding: 14 },
] as const
