import type { Interval } from './types'

/**
 * Estimates how many columns can fit inside the container by inverting the
 * linear width function for each interval. Because each interval is solved
 * independently, the complexity stays constant regardless of the interval count.
 */
export function estimateColumnCount(
	containerWidth: number,
	intervals: readonly Interval[],
): number {
	let result = 1

	for (const interval of intervals) {
		const { colMin, colMax, minItemWidth, gap } = interval

		// Invert the width function to find the maximum allowed column count:
		// widthNeeded(col) = col * minW + (col + 1) * gap
		// => col <= floor((w - gap) / (minW + gap))
		const maxByWidth = Math.floor((containerWidth - gap) / (minItemWidth + gap))

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
export function resolveInterval<T extends Interval>(
	intervals: readonly T[],
	cols: number,
): T {
	const interval =
		intervals.find(function(it) {
			return cols >= it.colMin && cols <= it.colMax
		})
		?? intervals[intervals.length - 1]
	return interval
}

/**
 * Converts a CSS grid `1fr` track definition into a concrete pixel width by
 * removing the total gutter and clamping the computed width to the container.
 */
export function computeFluidWidth(
	containerWidth: number,
	cols: number,
	gap: number,
): number {
	const raw = Math.max(0, containerWidth - (cols - 1) * gap) / cols
	return Math.min(containerWidth, raw)
}
