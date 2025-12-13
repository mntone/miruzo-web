import type { MasonryInterval } from './types'

// minItemWidth / gap が段階的に変化する仕様
export const defaultIntervals: readonly MasonryInterval[] = [
	// 1〜2 カラム区間（minItemWidth=160, gap=8）
	{ colMin: 1, colMax: 2, minItemWidth: 160, gap: 8 },

	// 3 カラム区間（minItemWidth=200, gap=16）
	{ colMin: 3, colMax: 3, minItemWidth: 200, gap: 16 },

	// 4 カラム以上（∞区間）
	{ colMin: 4, colMax: Infinity, minItemWidth: 320, gap: 16 },
]

export function getFixedItemWidth(cols: number, containerWidth: number): number | undefined {
	if (cols >= 4 || (cols === 3 && containerWidth >= 1024)) {
		// fluid 3 (200px) → fixed 3 (320px)
		// threshold = 3 * 320 + 5 * 16 = 1024px
		return 320
	}

	return undefined
}
