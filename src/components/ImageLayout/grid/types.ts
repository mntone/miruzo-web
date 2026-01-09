import type { LayoutProps } from '../shared/types'

export interface GridImageLayoutProps<Item> extends LayoutProps<Item> {
	readonly maxRows?: number
}
