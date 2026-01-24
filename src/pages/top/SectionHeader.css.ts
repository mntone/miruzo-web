import { style } from '@vanilla-extract/css'

export const header = style({
	margin: '0 var(--layout-padding)',
	fontSize: '150%',
	fontWeight: 400,
	lineHeight: 2,
})

export const button = style({
	backgroundColor: 'transparent',
	borderRadius: 0,
	font: 'inherit',
	lineHeight: 'inherit',
	overflow: 'visible',
	padding: 0,

	':hover': {
		textDecoration: 'underline',
	},
	':after': {
		backgroundColor: 'unset',
		opacity: 'unset',

		position: 'static',
		content: '\\2006\\203A',
		fontSize: '180%',
		fontWeight: 300,
		lineHeight: '.555',
		verticalAlign: 'text-top',
	},

	selectors: {
		[`&:hover::after`]: {
			opacity: 'unset',
		},
	},
})
