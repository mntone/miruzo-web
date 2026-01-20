import type { LayoutInterval } from '../shared/types'

// minItemWidth and gap scale in steps by column range.
export const defaultIntervals: readonly LayoutInterval[] = [
	// 1–2 columns (minItemWidth=160–, gap=8)
	{ colMin: 1, colMax: 2, minItemWidth: 160, spacing: 8 },

	// 3 columns (minItemWidth=200–320, gap=16)
	{ col: 3, minItemWidth: 200, maxItemWidth: 320, spacing: 16, outerPadding: 8 },

	// 4+ columns (open-ended range)
	{ colMin: 4, itemWidth: 320, spacing: 16, outerPadding: 8 },
] as const
