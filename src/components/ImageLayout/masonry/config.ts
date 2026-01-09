import type { LayoutInterval } from '../shared/types'

// minItemWidth and gap scale in steps by column range.
export const defaultIntervals: readonly LayoutInterval[] = [
	// 1–2 columns (minItemWidth=160, gap=8)
	{ colMin: 1, colMax: 2, minItemWidth: 160, maxItemWidth: Infinity, spacing: 8, outerPadding: 8 },

	// 3 columns (minItemWidth=240–320, gap=16)
	{ col: 3, minItemWidth: 240, maxItemWidth: 320, spacing: 16, outerPadding: 16 },

	// 4+ columns (open-ended range)
	{ colMin: 4, itemWidth: 320, spacing: 16, outerPadding: 16 },
]
