import { style } from '@vanilla-extract/css'

export const container = style({
	userSelect: 'none',
	vars: {
		'--g-columns': '1',
		'--g-gap': `8px`,
	},
})

export const layout = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(var(--g-columns), 1fr)',
	gap: `var(--g-gap)`,
	alignItems: 'center',
	justifyItems: 'center',
	margin: `0 var(--g-gap)`,
})

export const card = style({
	aspectRatio: 'var(--g-aspect-ratio)',
	maxWidth: '320px',
})

export const image = style({
	width: '100%',
	height: 'auto',
	imageRendering: 'smooth',
})
