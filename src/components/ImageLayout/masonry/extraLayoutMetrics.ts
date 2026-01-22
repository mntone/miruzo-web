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

export interface MasonryExtraLayoutMetrics {
	rowSize: number
	rowUnit: number
}

/**
 * Derive grid row sizing for masonry, accounting for fractional auto-row bugs.
 */
export function computeMasonryExtraLayoutMetrics(): MasonryExtraLayoutMetrics {
	const rowSize = hasBrokenFractionalGridAutoRows() ? 1 : window.devicePixelRatio
	const rowUnit = 1 / rowSize
	return {
		rowSize,
		rowUnit,
	}
}
