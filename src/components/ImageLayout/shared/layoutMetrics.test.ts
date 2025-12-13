import { computeFluidWidth, estimateColumnCount, resolveInterval } from './layoutMetrics'
import type { Interval } from './types'

const intervals: readonly Interval[] = [
	{ colMin: 1, colMax: 2, minItemWidth: 200, gap: 8 },
	{ colMin: 3, colMax: 3, minItemWidth: 200, gap: 16 },
	{ colMin: 4, colMax: Infinity, minItemWidth: 320, gap: 16 },
]

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

describe('computeFluidWidth', () => {
	it('removes the gutters and distributes the width evenly', () => {
		// container=600, cols=2, gap=16 => raw=(600 - 16)/2=292
		expect(computeFluidWidth(600, 2, 16)).toBe(292)
	})

	it('never returns a negative width even when gutters overflow the container', () => {
		// container=10, cols=2, gap=16 -> max term is clamped to 0 before dividing
		expect(computeFluidWidth(10, 2, 16)).toBe(0)
	})
})
