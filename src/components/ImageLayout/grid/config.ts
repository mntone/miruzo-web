import type { LayoutInterval } from '../shared/types'

// minItemWidth and gap scale in steps by column range.
export const defaultIntervals: readonly LayoutInterval[] = [
	// 1+ columns (minItemWidth=200, gap=8)
	{ colMin: 1, itemWidth: 200, spacing: 8, outerPadding: 0 },
]
