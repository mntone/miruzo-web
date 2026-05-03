import { createMemo, type Accessor } from 'solid-js'

import { computeLayoutMetrics, normalizeIntervals } from './shared/layoutMetrics'
import type { ComputeLayoutMetricsParams } from './shared/types'
import type { LayoutIntervals, LayoutMetrics } from './types'

export interface LayoutMetricsOptions {
	readonly intervals: LayoutIntervals
	readonly compute?: (params: ComputeLayoutMetricsParams) => LayoutMetrics
}

export function useLayoutMetrics(getRootWidth: Accessor<number>, options: LayoutMetricsOptions) {
	const intervals = normalizeIntervals(options.intervals)
	const _compute = options.compute ?? computeLayoutMetrics

	const getLayoutMetrics = createMemo(function() {
		const availableWidth = getRootWidth()
		return _compute({
			availableWidth,
			intervals,
		})
	})

	return getLayoutMetrics
}
