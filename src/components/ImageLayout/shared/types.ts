import type { Accessor, JSX } from 'solid-js'

export interface NormalizedLayoutInterval {
	colMin: number
	colMax: number
	minItemWidth: number
	maxItemWidth: number
	horizontalSpacing: number
	verticalSpacing: number
	outerPadding: number
}

export type NormalizedLayoutIntervals = readonly NormalizedLayoutInterval[]

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
		maxItemWidth: number
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
	outerPadding: number
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

export interface LayoutChildAccessors {
	getChildStyle: (itemHeight: number) => JSX.CSSProperties
	getChildWidth: Accessor<number>
	getNativeChildWidth: Accessor<number>
}

export interface LayoutPropsBase<Item> {
	readonly as: keyof HTMLElementTagNameMap
	readonly header: JSX.Element
	readonly children: (accessors: LayoutChildAccessors, item: Item) => JSX.Element
	readonly footer?: JSX.Element
	readonly getItems: Accessor<readonly Item[]>
}

export interface LayoutProps<Item> extends LayoutPropsBase<Item> {
	readonly intervals?: LayoutIntervals | undefined
}
