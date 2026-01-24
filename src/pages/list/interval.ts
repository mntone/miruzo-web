import type { LayoutInterval } from '~/components/ImageLayout'

// minItemWidth and gap scale in steps by column range.
export const listPageIntervals: readonly LayoutInterval[] = [
	// 1–2 columns
	{
		colEnd: 2,
		minItemWidth: 160,
		spacing: 8,
	},

	// 3 columns
	{
		colEnd: 3,
		minItemWidth: 200,
		maxItemWidth: 320,
		spacing: 16,
	},

	// 4+ columns
	{
		itemWidth: 320,
		spacing: 16,
	},
] as const
