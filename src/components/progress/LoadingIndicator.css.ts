import { keyframes, style } from '@vanilla-extract/css'

const spin = keyframes({
	to: { transform: 'rotate(1turn)' },
})

export const root = style({
	animation: `1.5s linear infinite ${spin}`,

	'@media': {
		'(prefers-reduced-motion: reduce)': {
			display: 'none',
		},
	},
})
