import { style, styleVariants } from '@vanilla-extract/css'

export const header = style({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	flexShrink: 0,
	marginInline: 'var(--sheet-spacing)',
})

export const container = style({
	position: 'relative',
	height: '100%',

	vars: {
		'--header-height': '0px',
		'--detail-aside-height': '120px',
		'--detail-aside-padding-block': '16px',
		'--detail-aside-offset': 'calc(100dvh - var(--header-height) - var(--detail-aside-height) + var(--detail-aside-padding-block))',
	},
})

export const main = style({
	overflow: 'clip',
	position: 'fixed',
	top: 'var(--header-height)',
	left: 0,
	right: 0,
	bottom: 'var(--detail-aside-height)',

	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	backgroundColor: '#000',
	colorScheme: 'only dark',
})

export const aside = style({
	padding: 'var(--detail-aside-offset) var(--layout-padding-right) var(--detail-aside-padding-block) var(--layout-padding-left)',
})

export const imageBox = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
})

export const image = style({
	width: '100%',
	height: '100%',
	objectFit: 'contain',
	userSelect: 'none',
})

export const imageLow = styleVariants(
	{
		visible: { filter: 'blur(2px)', opacity: 1 },
		revealed: { filter: 'blur(0)', opacity: 0 },
	},
	props => [image, {
		...props,
		position: 'absolute',
		transition: 'opacity 333ms ease, filter 333ms ease',
	}],
)

export const imageHigh = styleVariants(
	{
		none: 0,
		visible: 1,
	},
	opacity => [image, {
		opacity,
		transition: 'opacity 333ms ease',
	}],
)

export const imageHighInstant = style({
	transition: 'none',
})
