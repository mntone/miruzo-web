import type { Interval } from '../shared/types'
import type { ImageLayoutProps } from '../types'

export type MasonryInterval = Interval

export interface MasonryLayoutMetrics {
	cols: number
	gap: number
	rowUnit: number
	effectiveFinalWidth: number
	finalWidth: number
	fixedWidth?: number | undefined
	fluidWidth?: number | undefined
	layoutWidth?: number | undefined
}

export type GetFixedItemWidthFn = (cols: number, containerWidth: number) => number | undefined

export interface MasonryImageLayoutProps extends ImageLayoutProps {
	readonly intervals?: readonly MasonryInterval[]
	readonly getFixedItemWidth?: GetFixedItemWidthFn
}
