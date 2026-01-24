import type { Accessor, Component, JSX } from 'solid-js'

import type { LayoutMetrics } from '../types'

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

export interface LayoutRootProps {
	readonly as?: keyof HTMLElementTagNameMap | undefined
	readonly class?: string | undefined
	readonly footer?: JSX.Element
	readonly header?: JSX.Element
	readonly style?: JSX.CSSProperties | undefined
}

export interface LayoutItemsProps<Item> {
	readonly children: (
		item: Item,
		getIndex: Accessor<number>,
		getItemStyle?: (itemHeight: number) => JSX.CSSProperties,
	) => JSX.Element
	readonly getItems: Accessor<readonly Item[]>
	readonly getMetrics: Accessor<LayoutMetrics>
}

export interface LayoutProps<Item> extends LayoutRootProps, LayoutItemsProps<Item> {
}

export type LayoutComponent<Item> = Component<LayoutProps<Item>>
