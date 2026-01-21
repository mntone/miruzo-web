import { createMemo, type JSX } from 'solid-js'

import { normalizeError } from '~/utils/error'

interface ErrorMessageProps {
	readonly class?: string
	readonly error: unknown
	readonly label?: string
	readonly style?: JSX.CSSProperties
}

export function ErrorMessage(props: ErrorMessageProps) {
	const message = createMemo(function() {
		return normalizeError(props.error).message
	})
	const prefix = createMemo(function() {
		let label: string
		if (props.label !== undefined) {
			label = props.label + ': '
		} else {
			label = ''
		}
		return label
	})

	return (
		<p
			class={props.class}
			role='alert'
			style={props.style}
		>
			{prefix() + message()}
		</p>
	)
}
