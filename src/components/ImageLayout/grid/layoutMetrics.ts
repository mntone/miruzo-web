import {
	computeFluidWidth,
	estimateColumnCount,
	resolveInterval,
} from '../shared/layoutMetrics'

import type { GridInterval, GridLayoutMetrics } from './types'

export { estimateColumnCount }

/**
 * Combines the interval specification (piecewise-linear segments) with a custom
 * fixed-width resolver to derive the spacing, track width, and overall layout metrics.
 */
export function computeGridMetrics(
	containerWidth: number,
	intervals: readonly GridInterval[],
): GridLayoutMetrics {
	if (containerWidth === 0) {
		return {
			cols: 1,
			gap: intervals.length === 0 ? 0 : intervals[0].gap,
			effectiveItemWidth: 0,
			itemWidth: 0,
		}
	}

	// 1. Pick the column count based on the container width and breakpoints.
	const cols = estimateColumnCount(containerWidth, intervals)

	// 2. Read the gap value from the interval that matches the chosen column count.
	const interval = resolveInterval(intervals, cols)
	const gap = interval.gap

	// 3. Resolve the width from CSS grid math.
	const itemWidth = computeFluidWidth(containerWidth, cols, gap)

	// 4. Account for device-pixel scaling so we can request sharper assets and maintain consistent row units.
	const effectiveItemWidth = window.devicePixelRatio * itemWidth

	return {
		cols,
		gap,
		effectiveItemWidth,
		itemWidth,
	}
}
