import { keyframes, style, styleVariants } from '@vanilla-extract/css'

const slideUp = keyframes({
	from: { transform: 'translateY(100%)' },
	to: { transform: 'translateY(0)' },
})

export const sheet = style({
	display: 'flex',
	overflow: 'clip',
	position: 'absolute',
	top: 'env(safe-area-inset-top)',
	left: 'var(--sheet-horizontal)',
	right: 'var(--sheet-horizontal)',
	bottom: 'calc(100dvh - 100lvh)',
	width: 'var(--sheet-width)',

	animation: `${slideUp} 167ms ease-out`,
	backgroundColor: '#2C2C2E',
	borderTopLeftRadius: '32px',
	borderTopRightRadius: '32px',
	boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
	flexDirection: 'column',

	vars: {
		'--detail-aside-height': '120px',
		'--sheet-horizontal': 'calc(50vw - 0.5 * var(--sheet-width))',
		'--sheet-width': 'min(720px, calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right)))',
		'--sheet-spacing': '16px',
		'--sheet-extra-spacing': 'calc(100lvh - 100dvh)',
		'--sheet-offset-y': 'calc(100dvh - 60px - var(--detail-aside-height) + 16px)',
	},

	'@media': {
		'(prefers-color-scheme: light)': {
			backgroundColor: '#F2F2F7',
			boxShadow: '0 -2px 16px rgba(0,0,0,0.1)',
		},
	},
})

export const header = style({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
	flexShrink: 0,
	marginInline: 'var(--sheet-spacing)',
})

export const headerTitle = style({
	flexGrow: 1,
})

export const closeButton = style({
	fontSize: '.875em',
})

export const container = style({
	position: 'relative',
	height: '100%',
})

export const main = style({
	overflow: 'clip',
	position: 'absolute',
	inset: 0,
	bottom: 'calc(var(--detail-aside-height) + var(--sheet-extra-spacing))',

	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',

	backgroundColor: '#000',
	colorScheme: 'only dark',
})

export const aside = style({
	overflow: 'clip',
	overflowY: 'scroll',
	position: 'absolute',
	inset: 0,
	bottom: 'var(--sheet-extra-spacing)',

	padding: 'var(--sheet-offset-y) var(--sheet-spacing) 16px',
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
