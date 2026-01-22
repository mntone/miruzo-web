import { style } from '@vanilla-extract/css'

export const section = style({
	backgroundColor: 'var(--base-section-secondary)',
	borderRadius: '24px',
	marginBlock: '8px 24px',
	paddingBlock: '4px 14px',

	'@supports': {
		'(corner-shape: superellipse(1.333))': {
			borderRadius: '26px',
			cornerShape: 'superellipse(1.333)',
		},
	},
})
