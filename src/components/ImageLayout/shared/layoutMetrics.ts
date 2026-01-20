import type { ItemWidthMode, LayoutIntervals, LayoutMetrics, NormalizedLayoutInterval, NormalizedLayoutIntervals } from './types'

export function normalizeIntervals(intervals: LayoutIntervals): NormalizedLayoutIntervals {
	const normalized = intervals.map(function(interval) {
		let colMin: number
		let colMax: number = Infinity
		if ('col' in interval) {
			colMin = interval.col
			colMax = interval.col
		} else {
			colMin = interval.colMin
			if (interval.colMax !== undefined && interval.colMax >= colMin) {
				colMax = interval.colMax
			}
		}

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

		const horizontalSpacing = 'horizontalSpacing' in interval ? interval.horizontalSpacing : interval.spacing
		const verticalSpacing = 'verticalSpacing' in interval ? interval.verticalSpacing : interval.spacing
		return {
			colMin,
			colMax,
			minItemWidth,
			maxItemWidth,
			horizontalSpacing,
			verticalSpacing,
			outerPadding: interval.outerPadding || 0,
		}
	})
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

	for (const interval of intervals) {
		const { colMin, colMax, minItemWidth, horizontalSpacing: innerGap, outerPadding } = interval

		// Invert the width function to find the maximum allowed column count:
		// widthNeeded(col) = col * minW + (col - 1) * innerGap + 2 * outerPadding
		// => col <= floor((w - innerGap) / (minW + innerGap))
		const maxByWidth = Math.floor((containerWidth + innerGap - 2 * outerPadding) / (minItemWidth + innerGap))

		if (maxByWidth >= colMin) {
			const constrained = Math.min(maxByWidth, colMax)
			if (constrained > result) {
				result = constrained
			}
		}
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
			return cols >= it.colMin && cols <= it.colMax
		})
		?? intervals[intervals.length - 1]
	return interval
}

export function computeTotalInnerGap(cols: number, interval: NormalizedLayoutInterval): number {
	const totalInnerGap = (cols - 1) * interval.horizontalSpacing
	return totalInnerGap
}

/**
 * Converts a CSS grid `1fr` track definition into a concrete pixel width by
 * removing the total gutter and clamping the computed width to the container.
 */
export function computeFluidWidth(
	containerWidth: number,
	cols: number,
	spacing: number,
): number {
	const raw = Math.max(0, containerWidth - spacing) / cols
	return Math.min(containerWidth, raw)
}

/**
 * Combines the interval specification (piecewise-linear segments) with a custom
 * fixed-width resolver to derive the spacing, track width, and overall layout metrics.
 */
export function computeLayoutMetrics(availableWidth: number, intervals: NormalizedLayoutIntervals): LayoutMetrics {
	if (availableWidth === 0) {
		return {
			cols: 1,
			horizontalSpacing: 0,
			totalHorizontalSpacing: 0,
			verticalSpacing: intervals.length === 0 ? 8 : intervals[0].verticalSpacing,
			outerPadding: intervals.length === 0 ? 0 : intervals[0].outerPadding,
			itemWidth: 0,
			itemWidthMode: 'fixed',
			nativeItemWidth: 0,
		}
	}

	// 1. Pick the column count based on the container width and breakpoints.
	const cols = estimateColumnCount(availableWidth, intervals)

	// 2. Read the gap value from the interval that matches the chosen column count.
	const interval = resolveInterval(intervals, cols)

	// 3. Resolve whether this breakpoint uses a fixed card width (e.g. 320px).
	// const fixedWidth = getItemWidth(cols, availableWidth)

	// 4. When no fixed width is provided, derive the fluid width from CSS grid math.
	// let fluidWidth: number | undefined = undefined
	// if (fixedWidth === undefined) {
	// 	// Convert the “1fr” track size into an actual pixel value.
	// 	fluidWidth = computeFluidWidth(availableWidth, cols, innerGap)
	// }

	const totalHorizontalSpacing = computeTotalInnerGap(cols, interval)
	const spacing = totalHorizontalSpacing + 2 * interval.outerPadding
	const fluidWidth = computeFluidWidth(availableWidth, cols, spacing)

	let itemWidth: number, itemWidthMode: ItemWidthMode
	if (fluidWidth <= interval.maxItemWidth) {
		itemWidth = fluidWidth
		itemWidthMode = 'fluid'
	} else {
		itemWidth = interval.maxItemWidth
		itemWidthMode = 'fixed'
	}

	// 5. Use the fixed width when available, otherwise fall back to the fluid width.
	// const finalWidth = fixedWidth ?? fluidWidth!

	// 6. Only fixed-width layouts have a deterministic container width.
	// const containerWidth =
	// 	fixedWidth != null
	// 		? cols * fixedWidth + (cols - 1) * innerGap + 2 * outerPadding
	// 		: undefined

	const containerWidth = cols * itemWidth + spacing

	// 7. Account for device-pixel scaling so we can request sharper assets and maintain consistent row units.
	const nativeItemWidth = window.devicePixelRatio * itemWidth

	return {
		cols,
		horizontalSpacing: interval.horizontalSpacing,
		totalHorizontalSpacing,
		verticalSpacing: interval.verticalSpacing,
		outerPadding: interval.outerPadding,
		itemWidth,
		itemWidthMode,
		nativeItemWidth,
		containerWidth,
	}
}
