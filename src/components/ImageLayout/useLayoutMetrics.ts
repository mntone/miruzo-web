import { createMemo, type Accessor } from 'solid-js'

import { computeLayoutMetrics, normalizeIntervals } from './shared/layoutMetrics'
import type { NormalizedLayoutIntervals } from './shared/types'
import type { LayoutIntervals, LayoutMetrics } from './types'

export interface LayoutMetricsOptions {
	readonly intervals: LayoutIntervals
	readonly compute?: (width: number, intervals: NormalizedLayoutIntervals) => LayoutMetrics
}

export function useLayoutMetrics(getRootWidth: Accessor<number>, options: LayoutMetricsOptions) {
	const normalizedIntervals = normalizeIntervals(options.intervals)
	const _compute = options.compute ?? computeLayoutMetrics

	const getLayoutMetrics = createMemo(function() {
		const rootWidth = getRootWidth()
		return _compute(rootWidth, normalizedIntervals)
	})

	return getLayoutMetrics
}
