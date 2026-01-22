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
