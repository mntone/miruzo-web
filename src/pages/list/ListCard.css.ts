import { style } from '@vanilla-extract/css'

export const card = style({
	borderRadius: '24px',
	boxShadow: '0 1px 3px 0 rgb(0 0 0/.1), 0 1px 2px -1px rgb(0 0 0/.1)',
	transition: 'transform ease-out 123ms',
	width: '100%',

	':hover': {
		transform: 'translateY(-1px)',
	},

	'@supports': {
		'(corner-shape: superellipse(1.333))': {
			borderRadius: '28px',
			cornerShape: 'superellipse(1.333)',
		},
	},
})

export const image = style({
	width: '100%',
	height: '100%',
	minHeight: '10px',

	imageRendering: 'smooth',
	objectFit: 'cover',
	pointerEvents: 'none',
	verticalAlign: 'middle',
})
