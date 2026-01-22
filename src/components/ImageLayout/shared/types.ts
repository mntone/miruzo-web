import type { Accessor, Component, JSX } from 'solid-js'

import type { LayoutIntervals } from '../types'

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

export interface LayoutItemProps<Item> {
	readonly item: Item
	readonly itemWidth: number
	readonly nativeItemWidth: number
	readonly getItemStyle?: (itemHeight: number) => JSX.CSSProperties
}

export interface LayoutRootProps {
	readonly as?: keyof HTMLElementTagNameMap | undefined
	readonly class?: string | undefined
	readonly footer?: JSX.Element
	readonly header?: JSX.Element
	readonly intervals?: LayoutIntervals | undefined
	readonly style?: JSX.CSSProperties | undefined
}

export interface LayoutItemsProps<Item> {
	readonly getItems: Accessor<readonly Item[]>
	readonly itemComponent: Component<LayoutItemProps<Item>>
}

export interface LayoutProps<Item> extends LayoutRootProps, LayoutItemsProps<Item> {
}

export type LayoutComponent<Item> = Component<LayoutProps<Item>>
