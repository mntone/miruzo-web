import type { LayoutProps } from '../shared/types'

export interface GridLayoutProps<Item> extends LayoutProps<Item> {
	readonly maxRows?: number
}
