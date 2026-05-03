import type { Accessor, Component, JSX } from 'solid-js'

import type { LayoutMetrics } from '../types'

export interface NormalizedLayoutInterval {
	colEnd: number
	minItemWidth: number
	maxItemWidth: number
	innerGap: number
	outerGap: number
}

export type NormalizedLayoutIntervals = readonly NormalizedLayoutInterval[]

export interface ComputeLayoutMetricsParams {
	readonly availableWidth: number
	readonly intervals: NormalizedLayoutIntervals
}

export interface LayoutRootProps {
	readonly ref?: ((element: HTMLElement | undefined) => void) | undefined
	// Limit to content containers; avoid header/footer/article semantics.
	readonly as?: 'aside' | 'div' | 'main' | 'section' | undefined
	readonly class?: string | undefined
	readonly footer?: JSX.Element
	readonly header?: JSX.Element
	readonly style?: JSX.CSSProperties | undefined
	readonly onAnimationEnd?: JSX.EventHandlerUnion<HTMLElement, AnimationEvent> | undefined
	readonly onFocusIn?: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> | undefined
	readonly onFocusOut?: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> | undefined
	readonly onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> | undefined
}

export interface DynamicLayoutRootProps {
	readonly classList?: {
		[k: string]: boolean | undefined
	} | undefined
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

export interface LayoutProps<Item> extends LayoutRootProps, DynamicLayoutRootProps, LayoutItemsProps<Item> {
}

export type LayoutComponent<Item> = Component<LayoutProps<Item>>
