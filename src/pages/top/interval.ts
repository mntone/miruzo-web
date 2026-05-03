import type { LayoutInterval } from '~/components/ImageLayout'

// TopPage keeps bespoke intervals to preserve its intended grid density.
export const topPageIntervals: readonly LayoutInterval[] = [
	// 1–2 columns
	{
		colEnd: 2,
		minItemWidth: 160,
		innerGap: 8,
		outerGap: 10,
	},

	// 3 columns
	{
		colEnd: 3,
		minItemWidth: 205,
		maxItemWidth: 320,
		innerGap: 12,
		outerGap: 14,
	},

	// 4+ columns
	{
		itemWidth: 320,
		innerGap: 12,
		outerGap: 14,
	},
] as const
