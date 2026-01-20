import { style } from '@vanilla-extract/css'

export const section = style({
	backgroundColor: 'var(--base-section-secondary)',
	borderRadius: '24px',
	marginBlock: '8px 24px',
	paddingBlock: '4px 14px',
})

export const sectionHeader = style({
	margin: '.125em 0',
	fontSize: '1.5em',
	fontWeight: 400,
	lineHeight: 2,
})

export const sectionButton = style({
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
