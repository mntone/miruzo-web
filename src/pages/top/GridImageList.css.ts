import { globalStyle, style } from '@vanilla-extract/css'

export const section = style({
	marginBlock: '8px 24px',
})

globalStyle(`${section} .grid`, {
	backgroundColor: 'var(--base-section-secondary)',
	borderRadius: 'calc(10px + var(--layout-padding))',
	padding: 'var(--layout-padding)',

	'@supports': {
		'(corner-shape: superellipse(1.333))': {
			borderRadius: 'calc(12px + var(--layout-padding))',
			cornerShape: 'superellipse(1.333)',
		},
	},
})
