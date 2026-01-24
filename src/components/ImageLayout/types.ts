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

export type LayoutInterval = ItemWidthRange & SpacingRange & {
	colEnd?: number
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
