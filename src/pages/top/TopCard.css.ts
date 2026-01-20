import { style } from '@vanilla-extract/css'

export const card = style({
	contain: 'paint',
	contentVisibility: 'auto',
	overflow: 'clip',
	position: 'relative',

	aspectRatio: 'var(--g-item-aspect, 1.333)',
	borderRadius: '10px',
	boxSizing: 'content-box',
	width: 'var(--g-item-width, 100%)',

	boxShadow: '0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)',
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

export const backgroundImage = style({
	position: 'absolute',
	inset: 0,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	filter: 'blur(32px) brightness(0.4)',
	transform: 'scale(1.1)',
	pointerEvents: 'none',

	'@media': {
		'(prefers-color-scheme: light)': {
			filter: 'blur(32px) brightness(0.8)',
		},
	},
})

export const image = style({
	width: '100%',
	height: '100%',
	minHeight: '10px',

	imageRendering: 'smooth',
	objectFit: 'contain',
	pointerEvents: 'none',
	position: 'relative',
	verticalAlign: 'middle',
})
