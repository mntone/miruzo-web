import type { LayoutIntervals } from '../types'

import {
	computeFluidWidth,
	computeLayoutMetrics,
	computeTotalGapWidth,
	computeTotalInnerGapWidth,
	estimateColumnCount,
	normalizeIntervals,
	resolveInterval,
} from './layoutMetrics'

beforeAll(() => {
	vi.stubGlobal('window', { devicePixelRatio: 1 })
})

afterAll(() => {
	vi.unstubAllGlobals()
})

const intervals = normalizeIntervals([
	{ colEnd: 2, minItemWidth: 200, maxItemWidth: Infinity, innerGap: 8, outerGap: 12 },
	{ colEnd: 3, minItemWidth: 200, maxItemWidth: 320, innerGap: 16, outerGap: 24 },
	{ itemWidth: 320, innerGap: 16, outerGap: 24 },
] satisfies LayoutIntervals)

describe('estimateColumnCount', () => {
	it('returns the smallest column count when space is limited', () => {
		expect(estimateColumnCount(300, intervals)).toBe(1)
		expect(estimateColumnCount(450, intervals)).toBe(2)
	})

	it('respects each interval\'s upper bound', () => {
		// The third interval allows more than 3 columns only when the min width is met
		expect(estimateColumnCount(1024, intervals)).toBe(3)
		// Once there is enough space, the count can advance beyond 3
		expect(estimateColumnCount(1400, intervals)).toBeGreaterThanOrEqual(4)
	})
})

describe('resolveInterval', () => {
	it('returns the interval that covers the requested columns', () => {
		const interval = resolveInterval(intervals, 3)
		expect(interval).toBe(intervals[1])
	})

	it('falls back to the last interval when nothing matches', () => {
		const interval = resolveInterval(intervals, 10)
		expect(interval).toBe(intervals[2])
	})
})

describe('normalizeIntervals', () => {
	it('normalizes spacing shortcuts', () => {
		const normalized = normalizeIntervals([
			{ colEnd: 2, itemWidth: 240, innerGap: 12, outerGap: 20 },
		] satisfies LayoutIntervals)

		expect(normalized).toEqual([
			{
				colEnd: 2,
				minItemWidth: 240,
				maxItemWidth: 240,
				innerGap: 12,
				outerGap: 20,
			},
		])
	})

	it('fills missing colEnd with Infinity', () => {
		const normalized = normalizeIntervals([
			{ minItemWidth: 200, maxItemWidth: 320, innerGap: 16, outerGap: 24 },
		] satisfies LayoutIntervals)

		expect(normalized[0].colEnd).toBe(Infinity)
	})

	it('defaults optional values and clamps max item width', () => {
		const normalized = normalizeIntervals([
			{ colEnd: 2, minItemWidth: 240, innerGap: 12 },
			{ colEnd: 3, minItemWidth: 200, maxItemWidth: 160, innerGap: 12, outerGap: 8 },
		] satisfies LayoutIntervals)

		expect(normalized[0].outerGap).toBe(0)
		expect(normalized[0].maxItemWidth).toBe(Infinity)
		expect(normalized[1].maxItemWidth).toBe(200)
	})

	it('rejects open-ended ranges before the last interval', () => {
		const shouldThrow = import.meta.env.DEV
		const run = () => normalizeIntervals([
			{ colEnd: 2, minItemWidth: 200, innerGap: 8 },
			{ minItemWidth: 200, innerGap: 8 },
			{ itemWidth: 320, innerGap: 16 },
		] satisfies LayoutIntervals)

		if (shouldThrow) {
			expect(run).toThrow('LayoutInterval.colEnd must be set before the last interval')
		} else {
			expect(run).not.toThrow()
		}
	})
})

describe('computeFluidWidth', () => {
	it('removes the gutters and distributes the width evenly', () => {
		// container=600, cols=2, spacing=16 => raw=(600 - 16)/2=292
		expect(computeFluidWidth(600, 2, 16)).toBe(292)
	})

	it('never returns a negative width even when gutters overflow the container', () => {
		// container=10, cols=2, gap=16 -> max term is clamped to 0 before dividing
		expect(computeFluidWidth(10, 2, 16)).toBe(0)
	})
})

describe('computeTotalInnerGapWidth', () => {
	it('multiplies spacing by the number of gaps', () => {
		expect(computeTotalInnerGapWidth(4, intervals[2].innerGap)).toBe(48)
	})
})

describe('computeTotalGapWidth', () => {
	it('adds outer gaps to the total inner gap width', () => {
		expect(computeTotalGapWidth(4, intervals[2])).toBe(48 + 2 * 24)
	})
})

describe('computeMetrics', () => {
	it('returns safe defaults when the container width is zero', () => {
		const metrics = computeLayoutMetrics({
			availableWidth: 0,
			intervals,
		})
		expect(metrics).toEqual({
			cols: 1,
			innerGap: 8,
			outerGap: 12,
			itemNativeWidth: 0,
			itemWidth: 0,
			itemWidthMode: 'fixed',
			trackInnerGapWidth: 0,
			trackInnerWidth: 0,
		})
	})

	it('computes fluid widths based on the provided intervals', () => {
		const metrics = computeLayoutMetrics({
			availableWidth: 900,
			intervals,
		})
		expect(metrics.cols).toBe(3)
		expect(metrics.innerGap).toBe(16)
		expect(metrics.outerGap).toBe(24)

		expect(metrics.itemNativeWidth).toBe(metrics.itemWidth)
		expect(metrics.itemWidthMode).toBe('fluid')
		expect(metrics.itemWidth).toBeCloseTo((900 - 80) / 3, 5)
		expect(metrics.layoutWidth).toBeCloseTo(900, 5)
		expect(metrics.trackInnerGapWidth).toBe(2 * 16)
		expect(metrics.trackInnerWidth).toBe((900 - 80) + 2 * 16)
	})

	it('uses the fixed width value and produces a layout width', () => {
		const metrics = computeLayoutMetrics({
			availableWidth: 1200,
			intervals,
		})
		expect(metrics.cols).toBe(3)
		expect(metrics.itemNativeWidth).toBe(metrics.itemWidth)
		expect(metrics.itemWidth).toBe(320)
		expect(metrics.itemWidthMode).toBe('fixed')
		expect(metrics.layoutWidth).toBe(3 * 320 + 80)
		expect(metrics.trackInnerGapWidth).toBe(2 * 16)
		expect(metrics.trackInnerWidth).toBe(3 * 320 + 2 * 16)
	})

	it('switches to fixed width when the max item width is exceeded', () => {
		const metrics = computeLayoutMetrics({
			availableWidth: 1400,
			intervals,
		})
		expect(metrics.cols).toBe(4)
		expect(metrics.itemNativeWidth).toBe(metrics.itemWidth)
		expect(metrics.itemWidth).toBe(320)
		expect(metrics.itemWidthMode).toBe('fixed')
		expect(metrics.layoutWidth).toBe(4 * 320 + 2 * 24 + 3 * 16)
		expect(metrics.trackInnerGapWidth).toBe(2 * 24)
		expect(metrics.trackInnerWidth).toBe(4 * 320 + 2 * 24)
	})
})
