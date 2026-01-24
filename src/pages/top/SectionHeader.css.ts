import { style } from '@vanilla-extract/css'

export const header = style({
	margin: '0 var(--layout-padding)',
	fontSize: '150%',
	fontWeight: 400,
	lineHeight: 2,
})

export const button = style({
	':hover': {
		textDecoration: 'underline',
	},

	':after': {
		content: '\\2006\\203A',
		fontSize: '180%',
		fontWeight: 300,
		lineHeight: '.555',
		verticalAlign: 'text-top',
	},
})
