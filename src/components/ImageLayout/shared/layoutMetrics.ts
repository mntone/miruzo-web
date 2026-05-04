import type { ItemWidthMode, LayoutIntervals, LayoutMetrics } from '../types'

import type {
	AdjustLayoutMetricsOptions,
	ComputeLayoutMetricsParams,
	NormalizedLayoutInterval,
	NormalizedLayoutIntervals,
} from './types'

export function normalizeIntervals(intervals: LayoutIntervals): NormalizedLayoutIntervals {
	const normalized = new Array<NormalizedLayoutInterval>(intervals.length)

	let colStart = 1
	for (let i = 0; i < intervals.length; ++i) {
		const interval = intervals[i]

		const colEnd = interval.colEnd ?? Infinity
		if (import.meta.env.DEV) {
			if (interval.colEnd !== undefined && interval.colEnd < colStart) {
				throw Error(`LayoutInterval.colEnd must be >= colStart (${colStart})`)
			} else if (colEnd === Infinity && i < intervals.length - 1) {
				throw Error('LayoutInterval.colEnd must be set before the last interval')
			}
		}
		colStart = colEnd + 1

		let minItemWidth: number
		let maxItemWidth: number = Infinity
		if ('itemWidth' in interval) {
			minItemWidth = interval.itemWidth
			maxItemWidth = interval.itemWidth
		} else {
			minItemWidth = interval.minItemWidth
			if (interval.maxItemWidth !== undefined) {
				maxItemWidth = Math.max(minItemWidth, interval.maxItemWidth)
			}
		}

		let innerGap: number, outerGap: number
		if ('gap' in interval) {
			innerGap = interval.gap
			outerGap = interval.gap
		} else {
			innerGap = interval.innerGap
			outerGap = interval.outerGap || 0
		}

		normalized[i] = {
			colEnd,
			minItemWidth,
			maxItemWidth,
			innerGap,
			outerGap,
		}
	}

	return normalized
}

/**
 * Estimates how many columns can fit inside the container by inverting the
 * linear width function for each interval. Because each interval is solved
 * independently, the complexity stays constant regardless of the interval count.
 */
export function estimateColumnCount(
	containerWidth: number,
	intervals: NormalizedLayoutIntervals,
): number {
	let result = 1

	let colStart = 1
	for (const interval of intervals) {
		const { colEnd, minItemWidth, innerGap, outerGap } = interval

		// Invert the width function to find the maximum allowed column count:
		// widthNeeded(col) = col * minW + (col - 1) * innerGap + 2 * outerGap
		// => col <= floor((w + innerGap - 2 * outerGap) / (minW + innerGap))
		const maxByWidth = Math.floor((containerWidth + innerGap - 2 * outerGap) / (minItemWidth + innerGap))

		if (maxByWidth >= colStart) {
			const constrained = Math.min(maxByWidth, colEnd)
			if (constrained > result) {
				result = constrained
			}
		}

		colStart = colEnd + 1
	}

	return result
}

/**
 * Picks the interval configuration whose column range covers the provided count.
 * Falls back to the last interval as a safety net so layouts always have a gap.
 */
export function resolveInterval(intervals: NormalizedLayoutIntervals, cols: number): NormalizedLayoutInterval {
	const interval =
		intervals.find(function(it) {
			return cols <= it.colEnd
		})
		?? intervals[intervals.length - 1]
	return interval
}

export function computeTotalInnerGapWidth(cols: number, innerGap: number): number {
	return Math.max(0, cols - 1) * innerGap
}

export function computeTotalGapWidth(cols: number, interval: NormalizedLayoutInterval): number {
	return computeTotalInnerGapWidth(cols, interval.innerGap) + 2 * interval.outerGap
}

/**
 * Converts a CSS grid `1fr` track definition into a concrete pixel width by
 * subtracting total horizontal gaps, then dividing the remaining width by columns.
 * The result is never negative because the remainder is clamped at zero.
 */
export function computeFluidWidth(
	availableWidth: number,
	cols: number,
	totalGapWidth: number,
): number {
	return Math.max(0, availableWidth - totalGapWidth) / cols
}

/**
 * Combines the interval specification (piecewise-linear segments) with a custom
 * fixed-width resolver to derive the spacing, track width, and overall layout metrics.
 */
export function computeLayoutMetrics(params: ComputeLayoutMetricsParams): LayoutMetrics {
	const { availableWidth, intervals } = params

	if (availableWidth === 0) {
		return {
			cols: 1,
			innerGap: intervals.length === 0 ? 8 : intervals[0].innerGap,
			outerGap: intervals.length === 0 ? 0 : intervals[0].outerGap,
			itemNativeWidth: 0,
			itemWidth: 0,
			itemWidthMode: 'fixed',
			trackInnerGapWidth: 0,
			trackInnerWidth: 0,
		}
	}

	// 1. Pick the column count based on the container width and breakpoints.
	const cols = estimateColumnCount(availableWidth, intervals)

	// 2. Read the gap value from the interval that matches the chosen column count.
	const interval = resolveInterval(intervals, cols)
	const layoutTotalGapWidth = computeTotalGapWidth(cols, interval)
	const fluidWidth = computeFluidWidth(availableWidth, cols, layoutTotalGapWidth)

	// 3. Use fluid width while it stays within interval bounds; otherwise clamp to fixed max width.
	let itemWidth: number, itemWidthMode: ItemWidthMode
	if (fluidWidth <= interval.maxItemWidth) {
		itemWidth = fluidWidth
		itemWidthMode = 'fluid'
	} else {
		itemWidth = interval.maxItemWidth
		itemWidthMode = 'fixed'
	}

	const trackInnerGapWidth = computeTotalInnerGapWidth(cols, interval.innerGap)
	return {
		cols,
		innerGap: interval.innerGap,
		outerGap: interval.outerGap,

		itemNativeWidth: window.devicePixelRatio * itemWidth,
		itemWidth,
		itemWidthMode,
		layoutWidth: cols * itemWidth + layoutTotalGapWidth,
		trackInnerGapWidth,
		trackInnerWidth: cols * itemWidth + trackInnerGapWidth,
	}
}

export function adjustLayoutMetricsForItemCount(
	metrics: LayoutMetrics,
	options: AdjustLayoutMetricsOptions,
): LayoutMetrics {
	const { cols: baseCols, ...others } = metrics

	const renderCols = options.itemCount !== undefined
		? Math.max(1, Math.min(baseCols, options.itemCount))
		: baseCols

	const trackInnerGapWidth = computeTotalInnerGapWidth(renderCols, others.innerGap)
	return {
		...others,
		cols: renderCols,
		trackInnerGapWidth,
		trackInnerWidth: renderCols * others.itemWidth + trackInnerGapWidth,
	}
}
