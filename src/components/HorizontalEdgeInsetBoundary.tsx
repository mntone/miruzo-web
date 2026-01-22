import { type Accessor, createEffect, createMemo, createSignal, onCleanup, type Setter } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import type { Writable } from '~/@types/utils'

type HorizontalEdgeInset = readonly [left: number, right: number]

function equalsHorizontalEdgeInset(val1: HorizontalEdgeInset, val2: HorizontalEdgeInset): boolean {
	return val1[0] === val2[0] && val1[1] === val2[1]
}

function useHorizontalEdgeInset(
	getElement: Accessor<HTMLElement | undefined>,
	options: {
		readonly observeParent: boolean
	} | undefined,
): Accessor<HorizontalEdgeInset> {
	const [getEdgeInset, setEdgeInset] = createSignal<HorizontalEdgeInset>([0, 0])

	if (typeof ResizeObserver === 'undefined') {
		console.warn('ResizeObserver is not supported')
		return getEdgeInset
	}

	const observer = new ResizeObserver(function(entries) {
		const { left: leftInset, right } = entries[0].target.getBoundingClientRect()
		const rightInset = Math.max(0, window.visualViewport!.width - right)
		const next: Writable<HorizontalEdgeInset> = [leftInset, rightInset]

		// NOTE:
		// Scrollbar placement is direction-dependent in some environments (RTL).
		// This project currently assumes LTR only, so scrollbar width is always
		// applied to the physical right side. Revisit this logic if RTL support
		// becomes necessary.
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
		if (scrollbarWidth > 0) {
			next[1] += scrollbarWidth
		}

		if (!equalsHorizontalEdgeInset(next, getEdgeInset())) {
			setEdgeInset(next)
		}
	})
	onCleanup(observer.disconnect.bind(observer))

	let observedEl: HTMLElement | undefined
	createEffect(function() {
		const el = getElement()
		const next = options?.observeParent === true
			? el?.parentElement ?? undefined
			: el
		if (observedEl === next) {
			return
		}

		if (observedEl !== undefined) {
			observer.unobserve(observedEl)
		}
		if (next !== undefined) {
			observer.observe(next)
		}
		observedEl = next
	})

	return getEdgeInset
}

interface HorizontalEdgeInsetBoundaryProps {
	readonly as?: keyof HTMLElementTagNameMap
	readonly children: JSX.Element
	readonly class?: string
	readonly minHorizontalEdgeInset: number
	readonly observeParent?: boolean
	readonly preferMeasuredHorizontalInset?: boolean
	readonly ref?: Setter<HTMLElement | undefined>
	readonly style?: JSX.CSSProperties
}

export function HorizontalEdgeInsetBoundary(props: HorizontalEdgeInsetBoundaryProps) {
	// eslint-disable-next-line solid/reactivity -- read once on setup
	const setRef = props.ref
	onCleanup(function() {
		setRef?.(undefined)
	})

	const [getEl, setEl] = createSignal<HTMLElement | undefined>(undefined)
	function setElementDelegate(element: HTMLElement | undefined) {
		setEl(element)
		setRef?.(element)
	}

	// eslint-disable-next-line solid/reactivity -- fixed observe parent flag at setup
	const observeParent = props.observeParent
	const options = observeParent !== undefined ? { observeParent } : undefined
	const getEdgeInset = useHorizontalEdgeInset(getEl, options)
	const getStyle = createMemo(function(): JSX.CSSProperties {
		const edgeInset = getEdgeInset()
		const minLength = props.preferMeasuredHorizontalInset
			? props.minHorizontalEdgeInset
			: Math.max(props.minHorizontalEdgeInset, edgeInset[0], edgeInset[1])
		return {
			...props.style,
			'padding-left': `${Math.max(0, minLength - edgeInset[0])}px`,
			'padding-right': `${Math.max(0, minLength - edgeInset[1])}px`,
		}
	})

	return (
		<Dynamic
			ref={setElementDelegate}
			class={/* @once */ props.class}
			component={/* @once */ props.as || 'div'}
			style={getStyle()}
		>
			{/* @once */ props.children}
		</Dynamic>
	)
}
