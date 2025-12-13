import { style } from '@vanilla-extract/css'

export const container = style({
	margin: '0 env(safe-area-inset-right) 0 env(safe-area-inset-left)',
	userSelect: 'none',
	vars: {
		'--m-columns': '1',
		'--m-gap': '8px',
	},
})

export const layout = style({
	boxSizing: 'border-box',
	display: 'grid',
	columnGap: 'var(--m-gap)',
	gridTemplateColumns: 'repeat(var(--m-columns), var(--m-item-width))',
	gridAutoRows: 'var(--m-row-size, 1)',
	marginInline: 'auto',
	paddingInline: 'var(--m-gap)',
	width: 'var(--m-width, 100%)',
})

export const card = style({
	gridRowEnd: 'span var(--m-span, 10)',

	marginBottom: 'var(--m-gap)',
	height: 'var(--m-item-height)',
})
