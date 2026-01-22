type ColRange =
	| {
		colMin: number
		colMax?: number
	}
	| {
		col: number
	}

type ItemWidthRange =
	| {
		minItemWidth: number
		maxItemWidth?: number
	}
	| {
		itemWidth: number
	}

type SpacingRange =
	| {
		horizontalSpacing: number
		verticalSpacing: number
	}
	| {
		spacing: number
	}

export type LayoutInterval = ColRange & ItemWidthRange & SpacingRange & {
	outerPadding?: number
}

export type LayoutIntervals = readonly LayoutInterval[]

export type ItemWidthMode = 'fixed' | 'fluid'

export interface LayoutMetrics {
	cols: number
	horizontalSpacing: number
	totalHorizontalSpacing: number
	verticalSpacing: number
	outerPadding: number
	itemWidth: number
	itemWidthMode: ItemWidthMode
	nativeItemWidth: number
	containerWidth?: number | undefined
}
