import { style } from '@vanilla-extract/css'

export const sectionHeader = style({
	display: 'inline-block',
	margin: '.25em 0 .125em',
	fontSize: '1.5em',
	fontWeight: 400,
	lineHeight: 2,

	':after': {
		position: 'relative',
		bottom: '-.2rem',
		content: '\\2006\\203A',
		fontSize: '180%',
		fontWeight: 300,
		lineHeight: '1px',
	},
})
