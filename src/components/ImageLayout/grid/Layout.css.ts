import { style } from '@vanilla-extract/css'

export const container = style({
	boxSizing: 'border-box',
	marginInline: 'auto',
	WebkitUserSelect: 'none',
	userSelect: 'none',
})

export const layout = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: `var(--m-spacing-y, 8px) var(--m-spacing-x, 8px)`,
	alignItems: 'center',
})
