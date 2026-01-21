import type { Accessor, Component, JSX } from 'solid-js'

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

export interface LayoutItemPropsBase<Item> {
	readonly item: Item
	readonly itemWidth: number
	readonly nativeItemWidth: number
	readonly getItemStyle?: (itemHeight: number) => JSX.CSSProperties
}

export interface LayoutPropsBase<Item> {
	readonly header?: JSX.Element
	readonly footer?: JSX.Element
	readonly getItems: Accessor<readonly Item[]>
	readonly itemComponent: Component<LayoutItemPropsBase<Item>>
}

export interface LayoutProps<Item> extends LayoutPropsBase<Item> {
	readonly as?: keyof HTMLElementTagNameMap | undefined
	readonly class?: string | undefined
	readonly intervals?: LayoutIntervals | undefined
	readonly style?: JSX.CSSProperties | undefined
}

export type LayoutComponent<Item> = Component<LayoutProps<Item>>
