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
		'--sheet-horizontal': 'calc(50vw - 0.5 * var(--sheet-width))',
		'--sheet-bottom': 'max(8px, calc(100lvh - 100dvh + 8px))',
		'--sheet-width': 'min(720px, calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right)))',
		'--sheet-spacing': '16px',
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
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	padding: '0 0 var(--sheet-bottom)',
})

export const content = style({
	overflow: 'hidden',
	position: 'relative',
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
})

export const image = style({
	position: 'absolute',
	width: '100%',
	height: '100%',
	objectFit: 'contain',
	userSelect: 'none',
	backgroundColor: '#000',
})

export const imageLow = styleVariants(
	{
		visible: { filter: 'blur(2px)', opacity: 1 },
		revealed: { filter: 'blur(0)', opacity: 0 },
	},
	props => [image, {
		...props,
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
