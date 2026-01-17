import { computeLayoutMetrics } from '../shared/layoutMetrics'
import type { NormalizedLayoutIntervals } from '../shared/types'

import type { MasonryLayoutMetrics } from './types'

let needsIntegerGridRows: boolean | undefined

/**
 * WebKit/Blink handle fractional grid-auto-rows in coarse steps (not per pixel),
 * so span-based sizing can drift from the expected layout. When that happens,
 * fall back to integer row sizing.
 */
function hasBrokenFractionalGridAutoRows(): boolean {
	if (needsIntegerGridRows !== undefined) {
		return needsIntegerGridRows
	}

	const unitHeight = 1 / 3

	const container = document.createElement('div')
	container.style.display = 'grid'
	container.style.gridAutoRows = `${unitHeight}px`
	container.style.position = 'absolute'
	container.style.visibility = 'hidden'

	const child = document.createElement('div')
	child.style.gridRowEnd = 'span 6'
	container.appendChild(child)
	document.body.appendChild(container)

	const rect = container.getBoundingClientRect()
	document.body.removeChild(container)

	const expectedHeight = Math.round(unitHeight * 6)
	const flag = rect.height < expectedHeight - 0.001
	needsIntegerGridRows = flag
	return flag
}

/**
 * Combines the interval specification (piecewise-linear segments) with a custom
 * fixed-width resolver to derive the spacing, track width, and overall layout metrics.
 */
export function computeMasonryMetrics(containerWidth: number, intervals: NormalizedLayoutIntervals): MasonryLayoutMetrics {
	const baseMetrics = computeLayoutMetrics(containerWidth, intervals)

	const rowSize = hasBrokenFractionalGridAutoRows() ? 1 : window.devicePixelRatio
	const rowUnit = 1 / rowSize
	return Object.assign(baseMetrics, { rowSize, rowUnit })
}
