import type { Interval } from '../shared/types'
import type { ImageLayoutProps } from '../types'

export type GridInterval = Interval

export interface GridLayoutMetrics {
	cols: number
	gap: number
	effectiveItemWidth: number
	itemWidth: number
}

export interface GridImageLayoutProps extends ImageLayoutProps {
	readonly intervals?: readonly GridInterval[]
}
