import { computeGridMetrics } from './layoutMetrics'
import type { GridInterval } from './types'

beforeAll(() => {
	vi.stubGlobal('window', { devicePixelRatio: 1 })
})

afterAll(() => {
	vi.unstubAllGlobals()
})

const intervals: readonly GridInterval[] = [
	{ colMin: 1, colMax: 2, minItemWidth: 200, gap: 8 },
	{ colMin: 3, colMax: 3, minItemWidth: 200, gap: 16 },
	{ colMin: 4, colMax: Infinity, minItemWidth: 320, gap: 16 },
]

describe('computeGridMetrics', () => {
	it('returns safe defaults when the container width is zero', () => {
		expect(computeGridMetrics(0, intervals)).toEqual({
			cols: 1,
			gap: 8,
			effectiveItemWidth: 0,
			itemWidth: 0,
		})
	})

	it('computes fluid widths based on the provided intervals', () => {
		const metrics = computeGridMetrics(900, intervals)

		expect(metrics.cols).toBe(3)
		expect(metrics.gap).toBe(16)
		expect(metrics.itemWidth).toBeCloseTo((900 - 2 * 16) / 3, 5)
		expect(metrics.effectiveItemWidth).toBe(metrics.itemWidth)
	})

	it('increases the column count when the container is wide enough', () => {
		const metrics = computeGridMetrics(1400, intervals)

		expect(metrics.cols).toBeGreaterThanOrEqual(4)
		expect(metrics.itemWidth).toBeGreaterThanOrEqual(320)
	})
})
