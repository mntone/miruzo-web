import { style } from '@vanilla-extract/css'

export const container = style({
	boxSizing: 'border-box',
	marginInline: 'auto',
	userSelect: 'none',
})

export const layout = style({
	display: 'grid',
	columnGap: 'var(--g-spacing-x, 8px)',
	gridTemplateColumns: 'repeat(var(--m-columns, 1), var(--m-item-width, 40px))',
	gridAutoRows: 'var(--m-row-unit, 1px)',
})
