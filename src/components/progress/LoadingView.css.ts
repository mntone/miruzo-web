import { keyframes, style } from '@vanilla-extract/css'

const appear = keyframes({
	to: {
		visibility: 'visible',
	},
})

export const root = style({
	animation: `forwards ${appear}`,
	color: 'var(--text-secondary)',
	gap: '4px',
	visibility: 'hidden',
})
