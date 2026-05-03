type ItemWidthRange =
	| {
		/**
		 * Minimum item width used for column estimation within the interval.
		 */
		minItemWidth: number
		/**
		 * Optional fixed upper bound for fluid width in the interval.
		 * When omitted, the interval has no explicit upper bound.
		 */
		maxItemWidth?: number
	}
	| {
		/**
		 * Fixed item width for the interval.
		 * This is equivalent to setting both min and max width to the same value.
		 */
		itemWidth: number
	}

type ItemGapRange =
	| {
		/**
		 * Gap between items. Applies to both horizontal and vertical axes.
		 */
		innerGap: number
		/**
		 * Gap between the container edge and the item group.
		 * Applies to both horizontal and vertical axes.
		 */
		outerGap?: number
	}
	| {
		/**
		 * Shorthand that applies the same value to both `innerGap` and `outerGap`.
		 * The value is used for both horizontal and vertical axes.
		 */
		gap: number
	}

export type LayoutInterval = ItemWidthRange & ItemGapRange & {
	/**
	 * Inclusive upper column bound where this interval applies.
	 * When omitted, the interval is open-ended and is expected to be the last one.
	 */
	colEnd?: number
}

export type LayoutIntervals = readonly LayoutInterval[]

export type ItemWidthMode = 'fixed' | 'fluid'

export interface LayoutMetrics {
	cols: number
	innerGap: number
	outerGap: number

	itemNativeWidth: number
	itemWidth: number
	itemWidthMode: ItemWidthMode
	layoutWidth?: number | undefined
	trackInnerGapWidth: number
	trackInnerWidth: number
}
