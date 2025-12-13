import {
	computeFluidWidth,
	estimateColumnCount,
	resolveInterval,
} from '../shared/layoutMetrics'

import type { GetFixedItemWidthFn, MasonryInterval, MasonryLayoutMetrics } from './types'

export { estimateColumnCount }

/**
 * Combines the interval specification (piecewise-linear segments) with a custom
 * fixed-width resolver to derive the spacing, track width, and overall layout metrics.
 */
export function computeMasonryMetrics(
	containerWidth: number,
	intervals: readonly MasonryInterval[],
	getItemWidth: GetFixedItemWidthFn,
): MasonryLayoutMetrics {
	if (containerWidth === 0) {
		return {
			cols: 1,
			gap: intervals.length === 0 ? 0 : intervals[0].gap,
			rowUnit: 1,
			effectiveFinalWidth: 0,
			finalWidth: 0,
		}
	}

	// 1. Pick the column count based on the container width and breakpoints.
	const cols = estimateColumnCount(containerWidth, intervals)

	// 2. Read the gap value from the interval that matches the chosen column count.
	const interval = resolveInterval(intervals, cols)
	const gap = interval.gap

	// 3. Resolve whether this breakpoint uses a fixed card width (e.g. 320px).
	const fixedWidth = getItemWidth(cols, containerWidth)

	// 4. When no fixed width is provided, derive the fluid width from CSS grid math.
	let fluidWidth: number | undefined = undefined
	if (fixedWidth === undefined) {
		// Convert the “1fr” track size into an actual pixel value.
		fluidWidth = computeFluidWidth(containerWidth, cols, gap)
	}

	// 5. Use the fixed width when available, otherwise fall back to the fluid width.
	const finalWidth = fixedWidth ?? fluidWidth!

	// 6. Only fixed-width layouts have a deterministic container width.
	const layoutWidth =
		fixedWidth != null
			? cols * fixedWidth + (cols + 1) * gap
			: undefined

	// 7. Account for device-pixel scaling so we can request sharper assets and maintain consistent row units.
	const scale = window.devicePixelRatio
	const effectiveFinalWidth = scale * finalWidth
	const rowUnit = 1 / scale

	return {
		cols,
		gap,
		rowUnit,
		effectiveFinalWidth,
		finalWidth,
		fixedWidth,
		fluidWidth,
		layoutWidth,
	}
}
