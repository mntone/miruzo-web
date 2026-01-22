import type { LayoutProps, LayoutMetrics } from '../shared/types'

export interface MasonryLayoutMetrics extends LayoutMetrics {
	rowSize: number
	rowUnit: number
}

export type MasonryLayoutProps<Item> = LayoutProps<Item>
