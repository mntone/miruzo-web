import { computeMasonryMetrics } from './layoutMetrics'
import type { GetFixedItemWidthFn, MasonryInterval } from './types'

beforeAll(() => {
	vi.stubGlobal('window', { devicePixelRatio: 1 })
})

afterAll(() => {
	vi.unstubAllGlobals()
})

const intervals: readonly MasonryInterval[] = [
	{ colMin: 1, colMax: 2, minItemWidth: 200, gap: 8 },
	{ colMin: 3, colMax: 3, minItemWidth: 200, gap: 16 },
	{ colMin: 4, colMax: Infinity, minItemWidth: 320, gap: 16 },
]

describe('computeMetrics', () => {
	const getFixedWidth: GetFixedItemWidthFn = function(cols, containerWidth) {
		if (cols >= 4 || (cols === 3 && containerWidth >= 1024)) {
			return 320
		}
		return undefined
	}

	it('returns safe defaults when the container width is zero', () => {
		expect(computeMasonryMetrics(0, intervals, getFixedWidth)).toEqual({
			cols: 1,
			gap: 8,
			rowUnit: 1,
			effectiveFinalWidth: 0,
			finalWidth: 0,
		})
	})

	it('computes fluid widths based on the provided intervals', () => {
		const metrics = computeMasonryMetrics(900, intervals, () => undefined)

		expect(metrics.cols).toBe(3)
		expect(metrics.gap).toBe(16)
		expect(metrics.fixedWidth).toBeUndefined()
		expect(metrics.layoutWidth).toBeUndefined()
		expect(metrics.fluidWidth).toBeCloseTo((900 - 2 * 16) / 3, 5)
		expect(metrics.finalWidth).toBe(metrics.fluidWidth)
		expect(metrics.effectiveFinalWidth).toBe(metrics.finalWidth)
		expect(metrics.rowUnit).toBe(1)
	})

	it('uses the fixed width value and produces a layout width', () => {
		const metrics = computeMasonryMetrics(1200, intervals, getFixedWidth)

		expect(metrics.cols).toBe(3)
		expect(metrics.fixedWidth).toBe(320)
		expect(metrics.fluidWidth).toBeUndefined()
		expect(metrics.layoutWidth).toBe(3 * 320 + 4 * 16)
		expect(metrics.finalWidth).toBe(320)
		expect(metrics.effectiveFinalWidth).toBe(metrics.finalWidth)
		expect(metrics.rowUnit).toBe(1)
	})
})
