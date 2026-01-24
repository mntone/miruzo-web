import { style } from '@vanilla-extract/css'

export const card = style({
	position: 'relative',

	aspectRatio: 'var(--layout-item-aspect, 1.333)',
	borderRadius: '10px',
	boxShadow: '0 1px 3px 0 rgb(0 0 0/.1), 0 1px 2px -1px rgb(0 0 0/.1)',
	transition: 'transform ease-out 123ms',
	width: 'var(--layout-item-width, 100%)',

	':hover': {
		transform: 'translateY(-1px)',
	},

	'@supports': {
		'(corner-shape: superellipse(1.333))': {
			borderRadius: '12px',
			cornerShape: 'superellipse(1.333)',
		},
	},

	'::after': {
		position: 'absolute',
		inset: 0,

		backgroundColor: 'var(--fill-quaternary)',
		borderRadius: 'inherit',
		content: '',
		cornerShape: 'inherit',
		WebkitMask: 'linear-gradient(#000) content-box, linear-gradient(#000)',
		WebkitMaskComposite: 'destination-out',
		mask: 'linear-gradient(#000) content-box exclude, linear-gradient(#000)',
		padding: 1,
		pointerEvents: 'none',
	},
})

export const backgroundImage = style({
	position: 'absolute',
	inset: 0,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	filter: 'blur(32px) brightness(0.45)',
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
