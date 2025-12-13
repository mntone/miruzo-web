import { style } from '@vanilla-extract/css'

export const card = style({
	contain: 'strict',
	overflow: 'clip',
	userSelect: 'none',

	borderRadius: '2em', // 'calc(4px + .625em)',
	boxSizing: 'content-box',
	width: '100%',

	boxShadow: '0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)',
	color: '#0a0a0a',
	backgroundColor: '#FFF',
	transition: 'outline ease-out 123ms',

	':hover': {
		outline: '4px solid deeppink',
	},
})

export const image = style({
	width: '100%',
	height: '100%',
	imageRendering: 'smooth',
	objectFit: 'cover',
	pointerEvents: 'none',
	verticalAlign: 'middle',
})
