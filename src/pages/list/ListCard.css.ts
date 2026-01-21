import { style } from '@vanilla-extract/css'

export const card = style({
	contain: 'paint',
	contentVisibility: 'auto',
	overflow: 'clip',

	borderRadius: '2em', // 'calc(4px + .625em)',
	boxSizing: 'content-box',
	width: '100%',

	boxShadow: '0 1px 3px 0 rgb(0 0 0/.1), 0 1px 2px -1px rgb(0 0 0/.1)',
	color: '#0a0a0a',
	backgroundColor: '#FFF',
	transition: 'transform ease-out 123ms',

	':hover': {
		transform: 'translateY(-1px)',
	},

	'@supports': {
		'(font: -apple-system-body)': {
			contentVisibility: 'visible',
		},
		'not (overflow: clip)': {
			overflow: 'hidden',
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
