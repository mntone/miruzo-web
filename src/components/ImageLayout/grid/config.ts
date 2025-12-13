import type { GridInterval } from './types'

// minItemWidth / gap が段階的に変化する仕様
export const defaultIntervals: readonly GridInterval[] = [
	// 1〜2 カラム区間（minItemWidth=160, gap=8）
	{ colMin: 1, colMax: 2, minItemWidth: 160, gap: 8 },

	// 3 カラム区間（minItemWidth=200, gap=16）
	{ colMin: 3, colMax: 3, minItemWidth: 200, gap: 16 },

	// 4 カラム以上（∞区間）
	{ colMin: 4, colMax: Infinity, minItemWidth: 320, gap: 16 },
]
