import { createMemo, type Accessor } from 'solid-js'

import { adjustLayoutMetricsForItemCount, computeLayoutMetrics, normalizeIntervals } from './shared/layoutMetrics'
import type { ComputeLayoutMetricsParams } from './shared/types'
import type { LayoutIntervals, LayoutMetrics } from './types'

export interface LayoutMetricsOptions extends Omit<ComputeLayoutMetricsParams, 'availableWidth' | 'intervals'> {
	readonly intervals: LayoutIntervals
	readonly compute?: (params: ComputeLayoutMetricsParams) => LayoutMetrics
}

export function useLayoutMetrics(getRootWidth: Accessor<number>, options: LayoutMetricsOptions) {
	const { intervals: intervalsParam, compute, ..._options } = options
	const intervals = normalizeIntervals(intervalsParam)
	const _compute = compute ?? computeLayoutMetrics

	const getLayoutMetrics = createMemo(function() {
		const availableWidth = getRootWidth()
		return _compute({
			..._options,
			availableWidth,
			intervals,
		})
	})

	return getLayoutMetrics
}

export function useLayoutMetricsForItemCount(
	getBaseMetrics: Accessor<LayoutMetrics>,
	getItemCount: Accessor<number | undefined>,
) {
	const getLayoutMetricsForItemCount = createMemo(function() {
		const baseMetrics = getBaseMetrics()
		return adjustLayoutMetricsForItemCount(baseMetrics, {
			itemCount: getItemCount(),
		})
	})

	return getLayoutMetricsForItemCount
}
